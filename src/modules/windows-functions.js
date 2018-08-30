export const getTheme = () => {
  if (window.Windows) {
    const uiSettings = new window.Windows.UI.ViewManagement.UISettings();
    const color = uiSettings.getColorValue(
      window.Windows.UI.ViewManagement.UIColorType.background,
    );
    if (color.b === 0) {
      return 'dark';
    } else {
      return 'light';
    }
  }
  return null;
};

export const changeTitleBarTheme = theme => {
  if (window.Windows && window.Windows.UI.ViewManagement.ApplicationView) {
    const customColors =
      theme == 'dark'
        ? {
            backgroundColor: '#111',
            foregroundColor: '#fff',
            inactiveBackgroundColor: '#222',
            inactiveForegroundColor: '#fafafa',
          }
        : {
            backgroundColor: '#1565c0',
            foregroundColor: '#fff',
            inactiveBackgroundColor: '#5e92f3',
            inactiveForegroundColor: '#fafafa',
          };

    var titleBar = window.Windows.UI.ViewManagement.ApplicationView.getForCurrentView()
      .titleBar;
    titleBar.backgroundColor = customColors.backgroundColor;
    titleBar.foregroundColor = customColors.foregroundColor;
    titleBar.inactiveBackgroundColor = customColors.inactiveBackgroundColor;
    titleBar.inactiveForegroundColor = customColors.inactiveForegroundColor;
  }
};

export const notification = (title, body = '') => {
  if (!window.Windows) return null;
  const toastNotificationXmlTemplate = `<toast>
    <visual>
      <binding template="ToastGeneric">
        <text hint-maxLines="1"></text>
        <text></text>
      </binding>
    </visual>
  </toast>`;

  // Create ToastNotification as XML Doc
  let toastXml = new window.Windows.Data.Xml.Dom.XmlDocument();
  toastXml.loadXml(toastNotificationXmlTemplate);

  // Set notification texts
  let textNodes = toastXml.getElementsByTagName('text');
  textNodes[0].innerText = title;
  if (body) {
    textNodes[1].innerText = body;
  }

  // Create a toast notification from the XML, then create a ToastNotifier object to send the toast.
  const toast = new window.Windows.UI.Notifications.ToastNotification(toastXml);
  window.Windows.UI.Notifications.ToastNotificationManager.createToastNotifier().show(
    toast,
  );
};
