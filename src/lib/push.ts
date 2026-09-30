// Browser-only helpers for the admin PWA's push subscription flow. Scoped to
// /admin/ throughout — see public/admin-sw.js and app/admin/manifest.webmanifest.

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export const pushSupported = (): boolean =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export async function registerAdminServiceWorker(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin/" });
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.getRegistration("/admin/");
  if (!reg) return null;
  return reg.pushManager.getSubscription();
}

export async function subscribeToPush(publicKey: string): Promise<PushSubscription> {
  const reg = await registerAdminServiceWorker();
  await reg.update();
  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });
}
