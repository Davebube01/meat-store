// Admin push notifications only — deliberately no offline asset caching
// (no `fetch` handler): stock levels and order status change constantly, so
// serving a stale cached admin page would be actively misleading. Registered
// with scope "/admin/" from AdminLayout, so this never touches the storefront.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "MeatStore Admin", body: event.data.text() };
  }

  const { title = "MeatStore Admin", body, link = "/admin/dashboard", tag, icon } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      // Same tag replaces the OS-level notification instead of stacking;
      // no tag means every push shows on its own.
      icon: icon || "/admin/icons/icon-192.png",
      badge: "/admin/icons/icon-192.png",
      data: { link },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/admin/dashboard";

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const target = new URL(link, self.location.origin).href;

      // Focus an already-open admin tab and navigate it, rather than
      // stacking a new tab every time a notification is tapped.
      for (const client of clientsList) {
        if (client.url.startsWith(self.location.origin + "/admin")) {
          await client.focus();
          if ("navigate" in client) await client.navigate(target);
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});
