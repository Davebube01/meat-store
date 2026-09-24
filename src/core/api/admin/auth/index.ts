import { fetchClient } from "../../client";

export const adminLogin = async (email: string, password: string) => {
  return fetchClient<any>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const getAdminMe = async () => {
  return fetchClient<any>("/admin/auth/me");
};

export const logoutAdmin = async () => {
  await fetchClient<void>("/admin/auth/logout", { method: "POST" });
};
