export interface UserData {
  email: string;
  name: string;
  theme: 'light' | 'dark';
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface ApiResponse<T> {
  data: T;
}