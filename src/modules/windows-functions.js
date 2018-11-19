export const getTheme = () => {
  if (window.Windows) {
    const uiSettings = new window.Windows.UI.ViewManagement.UISettings()
    const color = uiSettings.getColorValue(
      window.Windows.UI.ViewManagement.UIColorType.background
    )
    if (color.b === 0) {
      return 'dark'
    } else {
      return 'light'
    }
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return null
}

export const changeTitleBarTheme = theme => {
  if (window.Windows && window.Windows.UI.ViewManagement.ApplicationView) {
    const customColors =
      theme === 'dark'
        ? {
            backgroundColor: { a: 255, r: 17, g: 17, b: 17 },
            foregroundColor: { a: 255, r: 255, g: 255, b: 255 },
            inactiveBackgroundColor: { a: 255, r: 34, g: 34, b: 34 },
            inactiveForegroundColor: { a: 255, r: 250, g: 250, b: 250 },
          }
        : {
            backgroundColor: { a: 255, r: 21, g: 101, b: 192 },
            foregroundColor: { a: 255, r: 255, g: 255, b: 255 },
            inactiveBackgroundColor: { a: 255, r: 0, g: 60, b: 143 },
            inactiveForegroundColor: { a: 255, r: 250, g: 250, b: 250 },
          }

    let titleBar = window.Windows.UI.ViewManagement.ApplicationView.getForCurrentView()
      .titleBar
    titleBar.backgroundColor = customColors.backgroundColor
    titleBar.foregroundColor = customColors.foregroundColor
    titleBar.inactiveBackgroundColor = customColors.inactiveBackgroundColor
    titleBar.inactiveForegroundColor = customColors.inactiveForegroundColor
  }
}

export const notification = (title, body = '') => {
  if (!window.Windows) return null
  const toastNotificationXmlTemplate = `<toast>
    <visual>
      <binding template="ToastGeneric">
        <text hint-maxLines="1"></text>
        <text></text>
      </binding>
    </visual>
  </toast>`

  // Create ToastNotification as XML Doc
  let toastXml = new window.Windows.Data.Xml.Dom.XmlDocument()
  toastXml.loadXml(toastNotificationXmlTemplate)

  // Set notification texts
  let textNodes = toastXml.getElementsByTagName('text')
  textNodes[0].innerText = title
  if (body) {
    textNodes[1].innerText = body
  }

  // Create a toast notification from the XML, then create a ToastNotifier object to send the toast.
  const toast = new window.Windows.UI.Notifications.ToastNotification(toastXml)
  window.Windows.UI.Notifications.ToastNotificationManager.createToastNotifier().show(
    toast
  )
}
