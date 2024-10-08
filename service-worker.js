const CACHE_NAME = 'my-app-cache-v3'; // قم بتغيير اسم الكاش لبدء نسخة جديدة
const urlsToCache = [
    '/collectionprogram/',                      // المسار الرئيسي للمجلد
    '/collectionprogram/index.html',            // الصفحة الرئيسية
    '/collectionprogram/all-customers.html',    // صفحة العملاء
    '/collectionprogram/current-month-customers.html', // صفحة العملاء الشهر الحالي
    '/collectionprogram/css/styles.css',        // ملف CSS
    '/collectionprogram/js/script.js',          // ملف JavaScript
    '/collectionprogram/next_page.html',        // صفحة إضافية
    '/collectionprogram/page1.html',            // صفحة إضافية أخرى
    '/collectionprogram/page2.html',            // صفحة إضافية أخرى
    '/collectionprogram/update-banka-misr.html', // صفحة تحديث
    '/collectionprogram/write-visit.html',      // صفحة الكتابة
    '/collectionprogram/package-lock.json',     // ملف JSON
    '/collectionprogram/package.json',          // ملف JSON
    // أضف أي ملفات أخرى حسب حاجتك
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files');
                return cache.addAll(urlsToCache);
            })
    );
    // فرض التفعيل فورًا بعد التثبيت
    self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // التأكد من التحكم في كل التابات النشطة
    self.clients.claim();
});

// الاستجابة للطلبات
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إذا كانت الاستجابة موجودة في الكاش، ارجعها
                if (response) {
                    return response;
                }
                
                // طلب جديد من الشبكة
                return fetch(event.request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // تخزين النسخة الجديدة في الكاش
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
    );
});

// إضافة منطق تحديث Service Worker تلقائياً
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
