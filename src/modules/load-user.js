import { users } from './feathers-services'

export default function(id, setSetting, setUserOption) {
  return new Promise((resolve, reject) => {
    users
      .get(id)
      .then(user => {
        // Load the user id into the settings as well just to make life a little easier
        setSetting('userId', user._id)
        if (user.settings) {
          Object.keys(user.settings).forEach(key => {
            const value = user.settings[key]
            setSetting(key, value, false)
          })
          delete user.settings
        }
        if (user.channels) {
          setSetting('channels', user.channels, false)
          delete user.channels
        }
        Object.keys(user).forEach(key => {
          const value = user[key]
          setUserOption(key, value, false)
        })
        resolve()
      })
      .catch(err => reject(err))
  })
}
