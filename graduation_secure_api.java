import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.Map;
import java.util.LinkedHashMap;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
/*
1.安全なパスワードハッシュ化と検証
内容: ソルト付きの実績あるハッシュ関数（bcrypt, Argon2, scrypt, PBKDF2 等）を使用してパスワードのハッシュ化および検証を実施すること。
不可: 平文保存、単純な MD5 や SHA-1 の使用。
*/

public class graduation_secure_api {
  //ストレッチング回数12を指定したsaltを用いたBCryptPasswordEncoderのインスタンスを作成
  static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
  static final ObjectMapper objectMapper = new ObjectMapper();

  static boolean secureConnection(Connection conn, String username, String password)
      throws SQLException, JsonProcessingException {
    /*
 2.SQLインジェクション対策（パラメータバインド）
内容: DB検索処理において、ユーザー入力を直接クエリ文字列へ連結せず、プレースホルダーを用いた安全なクエリを作成と実行
  */

   String query = "SELECT password FROM users WHERE username = ?";
    try (PreparedStatement pstmt = conn.prepareStatement(query)) {
      pstmt.setString(1, username);
      try (ResultSet rs = pstmt.executeQuery()) {
        boolean isValid = rs.next() && passwordEncoder.matches(password, rs.getString("password"));
        if (isValid) {
          return true;
        }
      }
    }/*
  3.構造化ログの出力
  内容: ログイン失敗時に、タイムスタンプ・ログレベル・原因・ユーザー情報などを含む JSON 形式の構造化ログ を出力すること。
  */
  Map<String, Object> logEntry = new LinkedHashMap<>();
  logEntry.put("timestamp", Instant.now().toString());
  logEntry.put("level", "WARN");
  logEntry.put("event", "Login_failure");
  logEntry.put("username", username);
  logEntry.put("reason", "password_mismatch");
  System.out.println(objectMapper.writeValueAsString(logEntry));

    return false;
  }
}
