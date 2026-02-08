// DUFIVE Service Worker — offline fallback + caching
const CACHE_NAME = 'dufive-v1';
const OFFLINE_URL = '/offline.html';

// Assets to pre-cache on install
const PRE_CACHE = [
  '/',
  '/index.html',
  '/disagreements.html',
  '/watchlist.html',
  '/manifest.json',
  '/assets/kc_face.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE).catch(() => {
        // If some assets fail, continue anyway
        console.warn('[SW] Some pre-cache assets failed');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and Supabase API requests
  if (request.method !== 'GET') return;
  if (request.url.includes('supabase.co')) return;
  if (request.url.includes('cdn.jsdelivr.net')) return;

  event.respondWith(
    // Network-first for HTML pages, cache-first for assets
    request.headers.get('accept')?.includes('text/html')
      ? networkFirst(request)
      : cacheFirst(request)
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      '<html><body style="background:#0a0a0a;color:#fff;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h1>DUFIVE</h1><p>You\'re offline. Check your connection.</p></div></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}
