const swPrecache = require('sw-precache')

// Generate Service Worker
const rootDir = 'build'
swPrecache.write(
  `${rootDir}/service-worker.js`,
  {
    staticFileGlobs: [
      rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}',
    ],
    stripPrefix: rootDir,
    maximumFileSizeToCacheInBytes: 4194304,
  },
  () => {
    console.log('Service worker generated')
  }
)
