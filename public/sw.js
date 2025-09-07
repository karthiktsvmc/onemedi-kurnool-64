// ONE MEDI Service Worker for PWA functionality
const CACHE_NAME = 'one-medi-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const CACHE_URLS = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// API endpoints to cache for offline access
const API_CACHE_PATTERNS = [
  /\/api\/medicines/,
  /\/api\/categories/,
  /\/api\/doctors/,
  /\/api\/hospitals/
];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return cached page or offline page
          return caches.match(request)
            .then(response => {
              return response || caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Handle API requests with cache-first strategy for specific endpoints
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    // Check if it's a cacheable API request
    const isCacheable = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
    
    if (isCacheable && request.method === 'GET') {
      event.respondWith(
        caches.open(CACHE_NAME)
          .then(cache => {
            return cache.match(request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  // Return cached response and update cache in background
                  fetch(request)
                    .then(response => {
                      if (response.status === 200) {
                        cache.put(request, response.clone());
                      }
                    })
                    .catch(() => {
                      // Ignore network errors when updating cache
                    });
                  return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(request)
                  .then(response => {
                    if (response.status === 200) {
                      cache.put(request, response.clone());
                    }
                    return response;
                  });
              });
          })
      );
      return;
    }
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.url.includes('.ico') ||
      request.url.includes('.png') ||
      request.url.includes('.jpg') ||
      request.url.includes('.css') ||
      request.url.includes('.js')) {
    
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then(response => {
              // Only cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // For all other requests, use network-first strategy
  event.respondWith(
    fetch(request)
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncOfflineData()
    );
  }
});

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push message received');
  
  const options = {
    body: 'You have a new notification from ONE MEDI',
    icon: '/icon-192.png',
    badge: '/icon-badge.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.body || options.body;
      options.data = data;
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification('ONE MEDI', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked');
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(clientList => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    console.log('Syncing offline data...');
    
    // Get offline data from IndexedDB or localStorage
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Sync each offline action
      for (const data of offlineData) {
        try {
          await syncDataItem(data);
          await removeOfflineData(data.id);
        } catch (error) {
          console.error('Failed to sync data item:', error);
        }
      }
    }
    
    console.log('Offline data sync completed');
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
}

// Get offline data (implement based on your storage strategy)
async function getOfflineData() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

// Sync individual data item
async function syncDataItem(data) {
  const response = await fetch(data.url, {
    method: data.method,
    headers: data.headers,
    body: data.body
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
  
  return response;
}

// Remove synced offline data
async function removeOfflineData(id) {
  // Remove from IndexedDB or localStorage
  console.log('Removed offline data item:', id);
}

// Handle skip waiting message from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});