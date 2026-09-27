/**
 * @file src/notifications/notificationService.ts
 * Configurable Biblical feast, Sabbath, and lunar event notification manager.
 * Supports Android APK native NotificationChannel (via AndroidBridge), Web Notification API,
 * and in-app alert banners so enabling notifications always responds immediately.
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
    if (saved) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
    }
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
 * Requests Android APK or browser notification permission when user enables notifications.
 * Never blocks or prevents the user from enabling in-app/calendar alerts even if browser popup is restricted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // 1. Android APK Native Notification Permission (Android 13+)
  if (typeof window !== 'undefined' && window.AndroidBridge) {
    try {
      const alreadyGranted = window.AndroidBridge.hasNotificationPermission?.() ?? true;
      if (alreadyGranted) return true;
      if (window.AndroidBridge.requestNotificationPermission) {
        const granted = await new Promise<boolean>((resolve) => {
          let settled = false;
          const handler = (evt: Event) => {
            if (settled) return;
            settled = true;
            window.removeEventListener('androidNotificationPermissionResult', handler);
            const detail = (evt as CustomEvent)?.detail;
            resolve(Boolean(detail?.granted));
          };
          window.addEventListener('androidNotificationPermissionResult', handler);
          window.AndroidBridge?.requestNotificationPermission?.();
          setTimeout(() => {
            if (!settled) {
              settled = true;
              window.removeEventListener('androidNotificationPermissionResult', handler);
              resolve(window.AndroidBridge?.hasNotificationPermission?.() ?? true);
            }
          }, 4000);
        });
        return granted;
      }
      return true;
    } catch {
      return true;
    }
  }

  // 2. Standard Web Notification API with non-blocking timeout
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      if (Notification.permission !== 'denied') {
        const permission = await Promise.race([
          Notification.requestPermission(),
          new Promise<NotificationPermission>((resolve) => setTimeout(() => resolve('default'), 2500)),
        ]);
        return permission === 'granted';
      }
    } catch {
      // Fallback to in-app notifications
    }
  }

  return false;
}

/**
 * Sends Android APK native notification, browser notification, and in-app banner alert.
 */
export function sendFeastNotification(title: string, body: string, forceSend = false): void {
  const settings = loadStoredNotificationSettings();
  if (!settings.enabled && !forceSend) return;

  // 1. Dispatch in-app notification event for immediate visual feedback
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dimenueveisFeastNotification', {
        detail: { title, body, timestamp: new Date().toISOString() },
      })
    );
  }

  // 2. Android APK native notification channel
  if (typeof window !== 'undefined' && window.AndroidBridge?.showNotification) {
    try {
      window.AndroidBridge.showNotification(title, body);
      return;
    } catch {
      // ignore and fall through
    }
  }

  // 3. Browser system notification
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
      });
    } catch {
      // ignore
    }
  }
}
