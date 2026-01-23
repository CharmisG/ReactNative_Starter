import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { FeatureFlags } from '../config/AppConfig';

class NotificationService {
    private static instance: NotificationService;
    private channelId: string = 'default_channel';

    private constructor() {
        this.initializeChannel();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    /**
     * Initialize notification channel for Android
     */
    private async initializeChannel(): Promise<void> {
        if (Platform.OS === 'android') {
            await notifee.createChannel({
                id: this.channelId,
                name: 'Default Channel',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibration: true,
            });
        }
    }

    /**
     * Request notification permissions
     */
    public async requestPermissions(): Promise<boolean> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled || !FeatureFlags.notifications?.features?.permissionChecking) {
            console.warn('Notifications are disabled via feature flag');
            return false;
        }

        try {
            if (Platform.OS === 'android') {
                // Android 13+ requires runtime permission
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
                return true; // Android < 13 doesn't need runtime permission
            } else {
                // iOS
                const settings = await notifee.requestPermission();
                return settings.authorizationStatus >= 1; // Authorized or Provisional
            }
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    }

    /**
     * Check if notification permissions are granted
     */
    public async hasPermission(): Promise<boolean> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled || !FeatureFlags.notifications?.features?.permissionChecking) {
            return false;
        }

        try {
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.check(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    return granted;
                }
                return true; // Android < 13 doesn't need runtime permission
            } else {
                const settings = await notifee.getNotificationSettings();
                return settings.authorizationStatus >= 1;
            }
        } catch (error) {
            console.error('Error checking notification permissions:', error);
            return false;
        }
    }

    /**
     * Send a local notification immediately
     */
    public async sendNotification(
        title: string,
        body: string,
        data?: Record<string, string>
    ): Promise<string | null> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled || !FeatureFlags.notifications?.features?.sending) {
            throw new Error('Notifications are disabled via feature flag');
        }

        try {
            // Check and request permissions if needed
            const hasPermission = await this.hasPermission();
            if (!hasPermission) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Notification permission not granted');
                }
            }

            // Ensure channel is created (Android)
            if (Platform.OS === 'android') {
                await this.initializeChannel();
            }

            const notificationId = await notifee.displayNotification({
                title,
                body,
                data,
                android: {
                    channelId: this.channelId,
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                    sound: 'default',
                    vibrationPattern: [300, 500],
                    // smallIcon will use default app icon if not specified
                },
                ios: {
                    sound: 'default',
                    foregroundPresentationOptions: {
                        alert: true,
                        badge: true,
                        sound: true,
                    },
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }

    /**
     * Schedule a notification for later
     */
    public async scheduleNotification(
        title: string,
        body: string,
        triggerDate: Date,
        data?: Record<string, string>
    ): Promise<string | null> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled || !FeatureFlags.notifications?.features?.scheduling) {
            throw new Error('Notification scheduling is disabled via feature flag');
        }

        try {
            const hasPermission = await this.hasPermission();
            if (!hasPermission) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Notification permission not granted');
                }
            }

            if (Platform.OS === 'android') {
                await this.initializeChannel();
            }

            const notificationId = await notifee.createTriggerNotification(
                {
                    title,
                    body,
                    data,
                    android: {
                        channelId: this.channelId,
                        importance: AndroidImportance.HIGH,
                        pressAction: {
                            id: 'default',
                        },
                        sound: 'default',
                    },
                    ios: {
                        sound: 'default',
                    },
                },
                {
                    type: TriggerType.TIMESTAMP,
                    timestamp: triggerDate.getTime(),
                }
            );

            return notificationId;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            throw error;
        }
    }

    /**
     * Cancel a notification by ID
     */
    public async cancelNotification(notificationId: string): Promise<void> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled || !FeatureFlags.notifications?.features?.canceling) {
            console.warn('Notification canceling is disabled via feature flag');
            return;
        }

        try {
            await notifee.cancelNotification(notificationId);
        } catch (error) {
            console.error('Error canceling notification:', error);
        }
    }

    /**
     * Cancel all notifications
     */
    public async cancelAllNotifications(): Promise<void> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled || !FeatureFlags.notifications?.features?.canceling) {
            console.warn('Notification canceling is disabled via feature flag');
            return;
        }

        try {
            await notifee.cancelAllNotifications();
        } catch (error) {
            console.error('Error canceling all notifications:', error);
        }
    }

    /**
     * Get all active notifications
     */
    public async getActiveNotifications(): Promise<any[]> {
        // Check if notifications are enabled
        if (!FeatureFlags.notifications?.enabled) {
            return [];
        }

        try {
            return await notifee.getTriggerNotifications();
        } catch (error) {
            console.error('Error getting active notifications:', error);
            return [];
        }
    }
}

export default NotificationService.getInstance();

