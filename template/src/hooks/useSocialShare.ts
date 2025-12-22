import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { socialShare } from '../utils/SocialShare';
import { FeatureFlags } from '../config/AppConfig';
import Translate from './Translate';

export const useSocialShare = () => {
    const [isSharing, setIsSharing] = useState(false);

    /**
     * Share using native share dialog
     */
    const share = useCallback(async (message?: string, title?: string) => {
        if (!FeatureFlags.socialShare?.enabled) {
            return false;
        }

        setIsSharing(true);
        try {
            const success = await socialShare.share(message, title);
            if (success) {
                // Optional: Show success toast
            }
            return success;
        } catch (error) {
            console.error('Share error:', error);
            return false;
        } finally {
            setIsSharing(false);
        }
    }, []);

    /**
     * Share to specific platform
     */
    const shareToPlatform = useCallback(async (platform: string, message?: string) => {
        if (!FeatureFlags.socialShare?.enabled) {
            return false;
        }

        setIsSharing(true);
        try {
            let success = false;

            switch (platform) {
                case 'whatsapp':
                    success = await socialShare.shareToWhatsApp(message);
                    break;
                case 'facebook':
                    success = await socialShare.shareToFacebook(message);
                    break;
                case 'twitter':
                    success = await socialShare.shareToTwitter(message);
                    break;
                case 'email':
                    success = await socialShare.shareViaEmail(message);
                    break;
                case 'sms':
                    success = await socialShare.shareViaSMS(message);
                    break;
                case 'clipboard':
                    success = await socialShare.copyToClipboard(message);
                    if (success) {
                        Alert.alert(Translate('Copied'), Translate('Link copied to clipboard'));
                    }
                    break;
                default:
                    success = await socialShare.share(message);
            }

            return success;
        } catch (error) {
            console.error('Platform share error:', error);
            return false;
        } finally {
            setIsSharing(false);
        }
    }, []);

    /**
     * Show share options menu
     */
    const showShareOptions = useCallback(async (message?: string) => {
        if (!FeatureFlags.socialShare?.enabled) {
            return;
        }

        if (Platform.OS === 'ios') {
            // On iOS, use native share sheet
            await share(message);
        } else {
            // On Android, show custom options or use native share
            await share(message);
        }
    }, [share]);

    return {
        isSharing,
        share,
        shareToPlatform,
        showShareOptions,
    };
};

