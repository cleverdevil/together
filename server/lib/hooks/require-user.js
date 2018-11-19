module.exports = hook =>
  new Promise((resolve, reject) => {
    if (
      !hook.params.user ||
      !hook.params.user.me ||
      !hook.params.user.accessToken ||
      !hook.params.user.settings ||
      !hook.params.user.settings.microsubEndpoint
    ) {
      reject({ message: 'Missing user data' })
    } else {
      resolve(hook)
    }
  })
