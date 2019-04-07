const cacheName = 'v2';


// Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            cacheNames.map(cache => {
                if(cache !== cacheName) {
                    console.log('Service Worker: Clearing old cache');
                    return caches.delete(cache)
                }
            })
        })
    )
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                // Copy of response
                const resClone = res.clone();
                // Open Cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // Add response to cache
                        cache.put(e.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(e.request).then(res => res))
    );
})