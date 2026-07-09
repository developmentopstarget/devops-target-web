export interface AuthUser {
  id: number | string;
  username: string;
  email: string;
  [key: string]: unknown;
}
