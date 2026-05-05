const BUILD_ID_KEY = "#core-nexus/build-id";

async function clearAllCaches(): Promise<void> {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((k) => caches.delete(k)));
}

async function unregisterServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
}

export async function checkBuildVersion(): Promise<void> {
  const stored = localStorage.getItem(BUILD_ID_KEY);
  if (stored === __BUILD_ID__) return;

  await clearAllCaches();
  await unregisterServiceWorkers();
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem(BUILD_ID_KEY, __BUILD_ID__);
  window.location.reload();
}
