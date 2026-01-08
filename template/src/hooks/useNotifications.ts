import { useCallback, useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import { showToast } from '../components/ToastContext';
import Translate from './Translate';
import { FeatureFlags } from '../config/AppConfig';

export const useNotifications = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isNotificationsEnabled = FeatureFlags.notifications?.enabled ?? true;

    useEffect(() => {
        if (isNotificationsEnabled) {
            checkPermission();
        } else {
            setHasPermission(false);
        }
    }, [isNotificationsEnabled]);

    const checkPermission = useCallback(async () => {
        if (!isNotificationsEnabled) {
            setHasPermission(false);
            return;
        }

        try {
            const granted = await NotificationService.hasPermission();
            setHasPermission(granted);
        } catch (error) {
            console.error('Error checking notification permission:', error);
            setHasPermission(false);
        }
    }, [isNotificationsEnabled]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!isNotificationsEnabled) {
            showToast({ text: Translate('Notifications are disabled'), type: 'error' });
            return false;
        }

        try {
            setIsLoading(true);
            const granted = await NotificationService.requestPermissions();
            setHasPermission(granted);
            if (granted) {
                showToast({ text: Translate('Notification permission granted'), type: 'success' });
            } else {
                showToast({ text: Translate('Notification permission denied'), type: 'error' });
            }
            return granted;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            showToast({ text: Translate('Failed to request notification permission'), type: 'error' });
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isNotificationsEnabled]);

    const sendTestNotification = useCallback(async () => {
        if (!isNotificationsEnabled) {
            showToast({ text: Translate('Notifications are disabled'), type: 'error' });
            return;
        }

        try {
            setIsLoading(true);

            // Check permission first
            if (!hasPermission) {
                const granted = await requestPermission();
                if (!granted) {
                    return;
                }
            }

            const title = Translate('Test Notification');
            const body = Translate('This is a test notification sent from the app!');

            await NotificationService.sendNotification(title, body, {
                type: 'test',
                timestamp: new Date().toISOString(),
            });

            showToast({ text: Translate('Notification sent successfully'), type: 'success' });
        } catch (error: any) {
            console.error('Error sending notification:', error);
            showToast({
                text: error?.message || Translate('Failed to send notification'),
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [hasPermission, requestPermission, isNotificationsEnabled]);

    const sendCustomNotification = useCallback(
        async (title: string, body: string, data?: Record<string, string>) => {
            if (!isNotificationsEnabled) {
                showToast({ text: Translate('Notifications are disabled'), type: 'error' });
                return;
            }

            try {
                setIsLoading(true);

                if (!hasPermission) {
                    const granted = await requestPermission();
                    if (!granted) {
                        return;
                    }
                }

                await NotificationService.sendNotification(title, body, data);
                showToast({ text: Translate('Notification sent successfully'), type: 'success' });
            } catch (error: any) {
                console.error('Error sending notification:', error);
                showToast({
                    text: error?.message || Translate('Failed to send notification'),
                    type: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        },
        [hasPermission, requestPermission, isNotificationsEnabled]
    );

    return {
        hasPermission,
        isLoading,
        sendTestNotification,
        sendCustomNotification,
        requestPermission,
        checkPermission,
    };
};

