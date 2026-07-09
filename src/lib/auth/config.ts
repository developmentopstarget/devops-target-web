const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const AUTH_COOKIE_NAME = "dt_token";

// djoser is mounted under /api/auth/ on the Django side (devops-target-api).
// /api/me/ is a separate, non-djoser endpoint that returns the current user.
export const AUTH_ENDPOINTS = {
  login: "/api/auth/token/login/",
  logout: "/api/auth/token/logout/",
  register: "/api/auth/users/",
  me: "/api/me/",
  resetPassword: "/api/auth/users/reset_password/",
  resetPasswordConfirm: "/api/auth/users/reset_password_confirm/",
} as const;
