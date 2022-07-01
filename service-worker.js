/** Lists of local resources we always want to be cached. */
import * as APP from "./cache/app.js";
import * as DB from "./cache/db.js";
import * as HTTP from "./cache/http.js";

/** Names of the two caches used in this version of the service worker.
 *  Change to v2, etc. when you update any of the local resources, which will
 *  in turn trigger the install event again.
 */
const RUNTIME = 'runtime';
const PRECACHES = [APP, DB, HTTP];

/** The install handler takes care of precaching the resources we always need. */
self.addEventListener('install', event => {
  console.debug('[ServiceWorker] Install');
  PRECACHES.forEach(db => {
    event.waitUntil(
      caches.open(db.PRECACHE)
        // .then(cache => cache.addAll(db.PRECACHE_URLS))
        .then(cache => {
          db.PRECACHE_URLS.forEach(url => {
            cache.add(url)
              .catch(err => {
                console.warn('[ServiceWorker] Error while precaching', url);
                console.error(err);
              });
          });
        })
        .then(self.skipWaiting())
        .catch(err => console.error(err))
    );
  });
});

/** The activate handler takes care of cleaning up old caches. */
self.addEventListener('activate', event => {
  console.debug('[ServiceWorker] Activate');
  const currentCaches = [RUNTIME];
  PRECACHES.forEach(db => currentCaches.push(db.PRECACHE));
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    })//.then(() => self.clients.claim())
  );
});

/** The fetch handler serves responses for same-origin resources from a cache.
 *  If no response is found, it populates the runtime cache with the response
 *  from the network before returning it to the page. 
 */
self.addEventListener('fetch', event => {
  /** Cache only what's in PRECACHE_URLS. */
  // if (PRECACHE_URLS.find(url => event.request.url.includes(url))) {
  
  /** Skip cross-origin requests, like those for Google Analytics. */
  if (event.request.url.startsWith(self.location.origin)) {
    console.debug('[ServiceWorker] Fetching', event.request.url, 'from cache.');
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            if(response.status === 404) {
              console.warn('[ServiceWorker] 404', event.request.url);
              return caches.match('404.html');
            }
            // if(response.status === 500) {
            //   console.warn('[ServiceWorker] 500', event.request.url);
            //   return caches.match('500.html');
            // }
            /** Put a copy of the response in the runtime cache. */
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});