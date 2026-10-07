import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class oauth_rate_limiter {

    // 256ビット（32バイト）以上のシークレットキー
    static final byte[] SECRET = "your-256-bit-secret-key-here-32bytes!".getBytes();

    // 1. JWT (HS256) の検証（要件 1）
    static Claims verifyJwt(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET))
                .requireIssuer("https://auth.example.com")
                .requireAudience("my-api-service")
                .build()
                .parseClaimsJws(token) // 期限切れ(exp)は ExpiredJwtException が投げられる
                .getBody();
    }

    // 2. Sliding Window レートリミッター（要件 2）
    static final Map<String, Deque<Long>> HITS = new ConcurrentHashMap<>();
    static final int MAX_REQUESTS = 100;
    static final long WINDOW_MS = 60_000L; // 60秒

    static Map<String, Object> isAllowed(String clientId) {
        long now = System.currentTimeMillis();
        Deque<Long> q = HITS.computeIfAbsent(clientId, k -> new ArrayDeque<>());

        synchronized (q) {
            // ウィンドウ外の古いリクエスト履歴を削除
            while (!q.isEmpty() && q.peekFirst() <= now - WINDOW_MS) {
                q.pollFirst();
            }

            Map<String, Object> r = new LinkedHashMap<>();
            long reset = (now + WINDOW_MS) / 1000;

            if (q.size() >= MAX_REQUESTS) {
                long retryAfter = (q.peekFirst() + WINDOW_MS - now) / 1000 + 1;
                r.put("allowed", false);
                r.put("limit", MAX_REQUESTS);
                r.put("remaining", 0L);
                r.put("reset", reset);
                r.put("retryAfter", retryAfter);
                return r;
            }

            q.addLast(now);
            r.put("allowed", true);
            r.put("limit", MAX_REQUESTS);
            r.put("remaining", (long) (MAX_REQUESTS - q.size()));
            r.put("reset", reset);
            r.put("retryAfter", 0L);
            return r;
        }
    }

    // 3〜5. 統合保護ミドルウェア（要件 3, 4, 5）
    static Map<String, Object> protectApi(Map<String, String> headers, String clientIp) {
        // クライアント識別（APIキーまたはIPアドレス）
        String clientId = headers.getOrDefault("X-API-Key", clientIp);
        Map<String, Object> rate = isAllowed(clientId);

        // レートリミット状態ヘッダーの設定（要件 4）
        Map<String, String> respHeaders = new LinkedHashMap<>();
        respHeaders.put("X-RateLimit-Limit", String.valueOf(rate.get("limit")));
        respHeaders.put("X-RateLimit-Remaining", String.valueOf(rate.get("remaining")));
        respHeaders.put("X-RateLimit-Reset", String.valueOf(rate.get("reset")));

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("headers", respHeaders);

        // 制限超過の判定 (HTTP 429 & Retry-After)（要件 3）
        if (Boolean.FALSE.equals(rate.get("allowed"))) {
            respHeaders.put("Retry-After", String.valueOf(rate.get("retryAfter")));
            resp.put("status", 429);
            resp.put("body", Map.of("error", "Too Many Requests"));
            return resp;
        }

        // Authorization ヘッダーの存在確認
        String auth = headers.getOrDefault("Authorization", "");
        if (!auth.startsWith("Bearer ")) {
            resp.put("status", 401);
            resp.put("body", Map.of("error", "Unauthorized", "message", "Missing bearer token"));
            return resp;
        }

        // JWT トークン検証 (HTTP 200 / 401)（要件 1, 5）
        try {
            Claims claims = verifyJwt(auth.substring(7));
            resp.put("status", 200);
            resp.put("body", Map.of("message", "Access granted", "user", claims.getSubject()));
        } catch (Exception e) {
            resp.put("status", 401);
            resp.put("body", Map.of("error", "Unauthorized", "message", e.getMessage()));
        }

        return resp;
    }
}
