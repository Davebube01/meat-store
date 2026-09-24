import { API_BASE_URL } from "@/core/api/client";

export function getFullImageUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Cloudinary can resize on the fly. Product photos are multi-megapixel
// originals, far too big for a 56px thumbnail, so ask for a small, cropped,
// auto-format copy instead. Non-Cloudinary URLs are returned untouched.
export function getThumbnailUrl(url: string | null | undefined, size = 160): string {
  const full = getFullImageUrl(url);
  if (!full.includes("res.cloudinary.com") || !full.includes("/image/upload/")) return full;
  return full.replace("/image/upload/", `/image/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`);
}
