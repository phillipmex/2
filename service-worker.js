// Service Worker for Doña Malena PWA
// Author: Generated for Doña Malena Restaurant
// Version: 1.0.0

const CACHE_NAME = 'dona-malena-v1.0.0';
const STATIC_CACHE = 'dona-malena-static-v1.0.0';
const DYNAMIC_CACHE = 'dona-malena-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-16x16.png',
    '/icons/apple-touch-icon.png',
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Files that can be cached dynamically
const DYNAMIC_FILES = [
    'https://fonts.gstatic.com/',
    'https://wa.me/'
];

// Files to never cache
const NEVER_CACHE = [
    '/sw.js',
    '/admin/',
    '/api/analytics'
];

// Install Event - Cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old caches that don't match current version
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName.startsWith('dona-malena-')) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
            .catch(error => {
                console.error('Service Worker: Error during activation:', error);
            })
    );
});

// Fetch Event - Handle requests with caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (