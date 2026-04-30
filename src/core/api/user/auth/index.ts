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
