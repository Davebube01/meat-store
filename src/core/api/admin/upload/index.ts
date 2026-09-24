import { API_BASE_URL, authFetch } from "../../client";

export const uploadAdminImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // No Content-Type header: the browser sets the multipart boundary itself.
  const res = await authFetch('/admin/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const { handleApiResponseError } = await import("@/core/errors/errorHandler");
    await handleApiResponseError(res);
  }
  const data = await res.json();
  // Cloudinary returns a full absolute URL — only relative paths (the old
  // local-disk upload's /uploads/... shape) need the backend origin prefixed.
  if (data.imageUrl.startsWith("http")) {
    return data.imageUrl;
  }
  return `${API_BASE_URL}${data.imageUrl}`;
};
