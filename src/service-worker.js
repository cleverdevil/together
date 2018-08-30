export default function(cb = () => {}) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      // if (navigator.serviceWorker.controller) {
      //   console.log('Active service worker found, no need to register');
      // } else {
      navigator.serviceWorker
        .register(swUrl)
        .then(reg => {
          reg.onupdatefound = () => {
            var installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    cb();
                  } else {
                    console.log('Content is now available offline!');
                  }
                  break;
                case 'redundant':
                  console.error(
                    'The installing service worker became redundant.',
                  );
                  break;
              }
            };
          };
        })
        .catch(e => {
          console.error('Error during service worker registration:', e);
        });
      // }
    });
  }
}
