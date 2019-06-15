/**
 * Uses https://images.weserv.nl/ to provide a resized image proxy.
 */
export default function(originalUrl, options = { dpr: 1, il: true }) {
  const url = encodeURIComponent(
    originalUrl.replace('http://', '').replace('https://', '')
  )
  let proxyUrl = `https://images.weserv.nl/?url=${url}&errorredirect=${url}`
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const value = options[key]
      if (value === true) {
        proxyUrl += '&' + key
      } else {
        proxyUrl += `&${key}=${value}`
      }
    }
  }
  return proxyUrl
}
