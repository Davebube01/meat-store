import { fetchClient } from "../../client";

export const authenticateUser = async (payload: any, isLogin: boolean) => {
  const endpoint = isLogin ? "/api/v1/auth/login/json" : "/api/v1/auth/register";
  return fetchClient<any>(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getUserMe = async () => {
  return fetchClient<any>("/api/v1/auth/me");
};

export interface LoginPayload {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
}

export interface RegisterResult extends LoginResult {
  user: any;
}

export const loginWithEmail = async (payload: LoginPayload) => {
  return fetchClient<LoginResult>("/api/v1/auth/login/json", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const registerAccount = async (payload: RegisterPayload) => {
  return fetchClient<RegisterResult>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logoutCustomer = async () => {
  await fetchClient<void>("/api/v1/auth/logout", { method: "POST" });
};

export const verifyEmailToken = async (token: string) => {
  return fetchClient<{ verified: boolean; claimed_orders: number }>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

export const resendVerificationEmail = async () => {
  return fetchClient<{ sent?: boolean; already_verified?: boolean }>("/api/v1/auth/resend-verification", {
    method: "POST",
  });
};
