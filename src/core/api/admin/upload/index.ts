import { API_BASE_URL, getAuthHeader } from "../../client";

export const uploadAdminImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    body: formData,
  });
  
  if (!res.ok) {
    const { handleApiResponseError } = await import("@/core/errors/errorHandler");
    await handleApiResponseError(res);
  }
  const data = await res.json();
  return `${API_BASE_URL}${data.imageUrl}`;
};
