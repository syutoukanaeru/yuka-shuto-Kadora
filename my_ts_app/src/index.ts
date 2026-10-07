// src/index.ts

type Profile = {
  name: string;
  language: string;
  level: number;
};

function introduce(profile: Profile): string {
  return `私は${profile.name}です。${profile.language}レベル${profile.level}です！`;
}

const myProfile: Profile = {
  name: "アルス",
  language: "TypeScript",
  level: 1,
};

const greeting: string = introduce(myProfile);
console.log(greeting);
