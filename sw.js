// ════════════════════════════════════════════════════════
// FlatSplit Service Worker
// Handles: offline caching, background notifications,
//          periodic reminder checks
// ════════════════════════════════════════════════════════

const CACHE_NAME = 'flatsplit-v1';
const CACHE_VERSION = '1.0.0';

// Files to cache for offline use
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:wght@300;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// ── INSTALL ──
self.addEventListener('install', (event) => {
  console.log('[SW] Installing FlatSplit Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app files');
      // Cache what we can, skip failures (e.g. Google Fonts may fail offline)
      return Promise.allSettled(
        CACHE_FILES.map(url => cache.add(url).catch(err => console.log('[SW] Skip cache:', url)))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH (offline support) ──
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  // Skip Firebase requests (always need network)
  if (event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('googleapis.com/identitytoolkit')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update in background
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        return cachedResponse;
      }
      // Not in cache — try network
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        return response;
      }).catch(() => {
        // Offline and not cached — return offline page for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── PUSH NOTIFICATIONS ──
self.addEventListener('push', (event) => {
  let data = { title: 'FlatSplit', body: 'You have a new update!' };
  try {
    data = event.data ? event.data.json() : data;
  } catch(e) {
    data.body = event.data ? event.data.text() : data.body;
  }

  const options = {
    body: data.body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || './' },
    actions: [
      { action: 'open', title: '👀 View', icon: './icon-192.png' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ],
    tag: 'flatsplit-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ── NOTIFICATION CLICK ──
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});

// ── BACKGROUND SYNC ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkAndFireReminders());
  }
});

// ── PERIODIC SYNC (check reminders in background) ──
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkAndFireReminders());
  }
});

async function checkAndFireReminders() {
  try {
    // Read reminders from all clients
    const allClients = await clients.matchAll({ includeUncontrolled: true });
    
    // Get reminders from localStorage via client message
    for (const client of allClients) {
      client.postMessage({ type: 'CHECK_REMINDERS' });
    }

    // Also check directly if we have access
    // (Service workers can't access localStorage directly)
    console.log('[SW] Reminder check triggered');
  } catch(e) {
    console.log('[SW] Reminder check error:', e);
  }
}

// ── MESSAGE FROM APP ──
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIRE_NOTIFICATION') {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title || 'FlatSplit', {
      body: body || '',
      icon: icon || './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'flatsplit-' + Date.now(),
    });
  }

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] FlatSplit Service Worker loaded v' + CACHE_VERSION);
