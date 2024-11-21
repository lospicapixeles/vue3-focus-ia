// Nombre del caché
const CACHE_NAME = 'face-api-models-v1';

// Archivos a almacenar en el caché
const FILES_TO_CACHE = [
    '/models/age_gender_model-shard1',
    '/models/age_gender_model-weights_manifest.json',
    '/models/face_expression_model-shard1',
    '/models/face_expression_model-weights_manifest.json',
    '/models/face_landmark_68_model-shard1',
    '/models/face_landmark_68_model-weights_manifest.json',
    '/models/face_landmark_68_tiny_model-shard1',
    '/models/face_landmark_68_tiny_model-weights_manifest.json',
    '/models/face_recognition_model-shard1',
    '/models/face_recognition_model-shard2',
    '/models/face_recognition_model-weights_manifest.json',
    '/models/mtcnn_model-shard1',
    '/models/mtcnn_model-weights_manifest.json',
    '/models/ssd_mobilenetv1_model-shard1',
    '/models/ssd_mobilenetv1_model-shard2',
    '/models/ssd_mobilenetv1_model-weights_manifest.json',
    '/models/tiny_face_detector_model-shard1',
    '/models/tiny_face_detector_model-weights_manifest.json'
];

// Instalar el Service Worker y almacenar los archivos en el caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Interceptar las solicitudes y responder desde el caché si es posible
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/models/')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});


// Actualizar el Service Worker eliminando cachés antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
