import layouts from './layouts'

const defaultSettings = {
  infiniteScroll: true,
  autoRead: true,
  layout: layouts[0].id,
}

export default function getSetting(uid, key, channelSettings = {}) {
  if (channelSettings[uid]) {
    return channelSettings[uid][key] || defaultSettings[key]
  } else {
    return defaultSettings[key]
  }
}

export function getAll(uid, channelSettings = {}) {
  if (channelSettings[uid]) {
    return Object.assign({}, defaultSettings, channelSettings[uid])
  } else {
    return defaultSettings
  }
}
