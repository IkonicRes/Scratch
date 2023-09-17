import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

const assetCache = new CacheFirst({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache assets for 30 days
    }),
  ],
});

// Register a route for caching image assets
registerRoute(
  ({ request }) => request.destination === 'image',
  ({ event }) => {
    return imageCache.handle({ event });
  }
);


const urlPattern = /^\.\/assets\/icons\/icon_(\d+)x(\d+)\.png$/;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const match = urlPattern.exec(request.url);

  if (match) {
    // Construct the cached URL with the content-based hash
    const cachedURL = `./assets/icons/icon_${match[1]}x${match[2]}.b3f7feffdd99e66192ef59dfff2e7202.png`;

    event.respondWith(
      caches.match(cachedURL).then((response) => {
        return response || fetch(request);
      })
    );
  }
});

// Register routes and apply caching strategies
registerRoute(
  ({ request }) => request.destination === 'document',
  ({ event }) => {
    return assetCache.handle({ event });
  }
);

registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  ({ event }) => {
    return assetCache.handle({ event });
  }
);

// Fallback for offline content
registerRoute(
  ({ request }) => request.mode === 'navigate',
  ({ event }) => {
    return assetCache.handle({ event });
  }
);

// Define caching strategies for different types of assets
const htmlCache = new StaleWhileRevalidate({
  cacheName: 'html-cache',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 7 * 24 * 60 * 60, // Cache HTML for 7 days
    }),
  ],
});

