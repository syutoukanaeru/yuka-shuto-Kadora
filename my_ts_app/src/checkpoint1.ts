interface User {
  id: number;
  name: string;
  email: string;
}
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: number;
}
const userResponse: ApiResponse<User> = {
  success: true,
  data: {
    id: 1,
    name: "John",
    email: "john@example.com",
  },
  timestamp: Date.now(),
};
const scoresResponse: ApiResponse<number[]> = {
  success: true,
  data: [95, 87, 78],
  timestamp: Date.now(),
};

console.log(userResponse);
console.log(scoresResponse);
