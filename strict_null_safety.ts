interface ApiUser {
  id: number;
  name?: string;
  email?: string;
  score?: number;
  profile?: {
    bio?: string;
    website?: string;
  };
}

function formatUserInfo(user: ApiUser | null | undefined): string {
  if (!user) {
    return "ユーザー情報なし";
  }
  const name = user.name ?? "名無し";
  const email = user.email ?? "未登録";
  const score = user.score ?? 0;
  const bio = user.profile?.bio ?? "自己紹介なし";
  const website = user.profile?.website ?? "なし";

  return [
    `ID: ${user.id}`,
    `名前: ${name}`,
    `メール: ${email}`,
    `スコア: ${score}`,
    `自己紹介: ${bio}`,
    `サイト: ${website}`,
  ].join("\n");
}

console.log(formatUserInfo(null));
console.log("---");
console.log(
  formatUserInfo({ id: 1, name: "アルス", score: 0, profile: { bio: "" } }),
);
