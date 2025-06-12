// Service Worker for Spark-X Platforms PWA
// Version 1.0.0

const CACHE_NAME = 'spark-x-platforms-v1.0.0';
const STATIC_CACHE = 'spark-x-static-v1.0.0';
const DYNAMIC_CACHE = 'spark-x-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/sw-register.js',
    '/manifest.json',
    // Add essential icons when created
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // External resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Files to cache on demand
const DYNAMIC_ASSETS = [
    // API endpoints would go here in a real app
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
    '/api/',
    '/auth/'
];

// Cache-first resources (serve from cache, fallback to network)
const CACHE_FIRST = [
    '/css/',
    '/js/',
    '/icons/',
    '/images/',
    'https://cdnjs.cloudflare.com/'
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch Event - Handle requests with different strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Determine caching strategy based on request
    if (isNetworkFirst(request.url)) {
        event.respondWith(networkFirst(request));
    } else if (isCacheFirst(request.url)) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Network First Strategy - For dynamic content
async function networkFirst(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // If successful, cache the response
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache...', error);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If no cache, return offline page
        return getOfflinePage(request);
    }
}

// Cache First Strategy - For static assets
async function cacheFirst(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        
        // Cache the response
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Both cache and network failed:', error);
        return getOfflinePage(request);
    }
}

// Stale While Revalidate Strategy - For general content
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Get from cache immediately
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in background
    const networkPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch((error) => {
        console.log('Service Worker: Network update failed:', error);
    });
    
    // Return cached version immediately, or wait for network if no cache
    return cachedResponse || networkPromise;
}

// Helper Functions
function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function isCacheFirst(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern));
}

// Generate offline page response
function getOfflinePage(request) {
    // For navigation requests, return offline page
    if (request.mode === 'navigate') {
        return new Response(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Spark-X Platforms</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #f59e0b 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-align: center;
                    }
                    .offline-container {
                        max-width: 500px;
                        padding: 2rem;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                        opacity: 0.8;
                    }
                    .offline-title {
                        font-size: 2rem;
                        margin-bottom: 1rem;
                        font-weight: bold;
                    }
                    .offline-message {
                        font-size: 1.1rem;
                        margin-bottom: 2rem;
                        opacity: 0.9;
                        line-height: 1.6;
                    }
                    .retry-btn {
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 2px solid white;
                        padding: 1rem 2rem;
                        font-size: 1rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        backdrop-filter: blur(10px);
                        transition: all 0.3s ease;
                    }
                    .retry-btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: translateY(-2px);
                    }
                    .features-list {
                        text-align: left;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 0.5rem;
                        padding: 1.5rem;
                        margin: 2rem 0;
                        backdrop-filter: blur(10px);
                    }
                    .features-list h3 {
                        margin-top: 0;
                        color: #f59e0b;
                    }
                    .features-list ul {
                        margin: 0;
                        padding-left: 1.5rem;
                    }
                    .features-list li {
                        margin-bottom: 0.5rem;
                        opacity: 0.9;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="offline-icon">📱</div>
                    <h1 class="offline-title">You're Offline</h1>
                    <p class="offline-message">
                        Don't worry! Spark-X Platforms works offline too. 
                        Some features are still available while you're disconnected.
                    </p>
                    
                    <div class="features-list">
                        <h3>Available Offline:</h3>
                        <ul>
                            <li>Browse cached content</li>
                            <li>View platform information</li>
                            <li>Access previously loaded data</li>
                            <li>Use core app features</li>
                        </ul>
                    </div>
                    
                    <button class="retry-btn" onclick="window.location.reload()">
                        Try Again
                    </button>
                </div>
            </body>
            </html>
        `, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'text/html'
            }
        });
    }
    
    // For other requests, return a simple offline response
    return new Response(JSON.stringify({
        error: 'Offline',
        message: 'This feature requires an internet connection'
    }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Background Sync (for future use)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync any pending data when back online
        console.log('Service Worker: Performing background sync...');
        
        // In a real app, this would sync user data, send queued requests, etc.
        // For now, just log that sync is working
        
        return Promise.resolve();
    } catch (error) {
        console.log('Service Worker: Background sync failed:', error);
        throw error;
    }
}

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push message received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icons/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Spark-X Platforms', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message Handler (for communication with main thread)
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received:', event.data);
    
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }
});

// Periodic Background Sync (for future use)
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'periodic-background-sync') {
        event.waitUntil(doPeriodicSync());
    }
});

async function doPeriodicSync() {
    try {
        console.log('Service Worker: Performing periodic sync...');
        
        // In a real app, this could:
        // - Update cached content
        // - Sync user preferences
        // - Preload new content
        
        return Promise.resolve();
    } catch (error) {
        console.log('Service Worker: Periodic sync failed:', error);
        throw error;
    }
}

// Cache Cleanup - Remove old entries
async function cleanupCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Keep only the 50 most recent entries
    if (requests.length > 50) {
        const requestsToDelete = requests.slice(50);
        await Promise.all(
            requestsToDelete.map((request) => cache.delete(request))
        );
        console.log(`Service Worker: Cleaned up ${requestsToDelete.length} old cache entries`);
    }
}

// Run cache cleanup periodically
setInterval(cleanupCache, 24 * 60 * 60 * 1000); // Once per day

console.log('Service Worker: Script loaded successfully');
