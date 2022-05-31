/** Names of the two caches used in this version of the service worker.
 *  Change to v2, etc. when you update any of the local resources, which will
 *  in turn trigger the install event again.
 */
// const PRECACHE = 'precache-v1';
// const PRECACHE = 'precache-empty';
const PRECACHE = 'precache-dataonly-20220531-1010';
const RUNTIME = 'runtime';

/** A list of local resources we always want to be cached. */
const PRECACHE_URLS = [
  "/database/db/tables.json",
  "/database/db/data/arbres-remarquables.json",
  "/database/db/data/arbres.json",
  "/database/db/data/espaces-verts.json",
  "/database/db/data/jardins-partages.json",
  "/database/db/filter/arbres.json",
  "/database/img/Jardin_des_Plantes_Paris_figures_strolling_the_grounds_alongside_the_glasshouses._Coloured_lithograph_by_J._Jacottet.coupe.jpg",
  "/database/img/Jardin_du_Roy_Les_serres_...Hilair_Jean-Baptiste_btv1b103030852.jfif",
  "/database/img/jean-baptiste-d-EkE-eqz_CJE-unsplash.jpg",
  "/database/img/Les_Rougon-Macquart_2_La_curee_...Zola_Emile_bpt6k5804559h.jfif",
  "/database/img/Le_pere_Goriot_Nouvelle_edition_...Balzac_Honore_bpt6k6305332g.JPEG",
  "/database/img/louis-paulin-z4TOhAEXrCA-unsplash.jpg",
  "/database/img/map-btv1b530855456.jpg",
  "/database/img/maquis-montmartre.jpg",
  "/database/img/plan-de-paris-bis.jpg",
  "/database/img/Rue_Saint-Honore_in_the_Afternoon._Effect_of_Rain.jpeg",
];

/** The install handler takes care of precaching the resources we always need. */
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

/** The activate handler takes care of cleaning up old caches. */
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

/** The fetch handler serves responses for same-origin resources from a cache.
 *  If no response is found, it populates the runtime cache with the response
 *  from the network before returning it to the page. 
 */
self.addEventListener('fetch', event => {
  /** Skip cross-origin requests, like those for Google Analytics. */
  // if (event.request.url.startsWith(self.location.origin)) {
  /** Cache only what's in PRECACHE_URLS. */
  if (PRECACHE_URLS.find(url => event.request.url.includes(url))) {
    console.log('[ServiceWorker] Fetching', event.request.url, 'from cache.');
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
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