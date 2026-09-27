/**
 * @file src/notifications/notificationService.ts
 * Configurable Biblical feast, Sabbath, and lunar event notification manager.
 */

export interface NotificationSettings {
  enabled: boolean;
  upcomingFeastAlert: boolean; // 24 hours prior to feast
  feastBeginningAlert: boolean;
  feastEndingAlert: boolean;
  weeklySabbathAlert: boolean; // Friday sunset / Sabbath morning
  dayZeroAlert: boolean;
  newMoonAlert: boolean;
  fullMoonAlert: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false, // OFF by default as required
  upcomingFeastAlert: true,
  feastBeginningAlert: true,
  feastEndingAlert: true,
  weeklySabbathAlert: true,
  dayZeroAlert: true,
  newMoonAlert: true,
  fullMoonAlert: true,
};

export function loadStoredNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem('dimenueveis_notifications');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load notification settings', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem('dimenueveis_notifications', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings', e);
  }
}

/**
 * Requests browser notification permission if user enables notifications.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Sends in-app or browser notification.
 */
export function sendFeastNotification(title: string, body: string): void {
  const settings = loadStoredNotificationSettings();
  if (!settings.enabled) return;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }
}
