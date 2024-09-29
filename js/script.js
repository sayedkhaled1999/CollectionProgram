function navigateTo(page) {
  window.location.href = page;
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/collectionprogram/sw.js').then((registration) => {
      registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                      // تم التحديث
                      console.log('New content is available, please refresh.');
                      if (confirm("يوجد تحديث جديد للتطبيق. هل ترغب في التحديث؟")) {
                          window.location.reload();
                      }
                  }
              }
          };
      };
  });
}

