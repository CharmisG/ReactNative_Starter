import { Share, Platform, Alert, Linking } from 'react-native';
import { FeatureFlags } from '../config/AppConfig';
import { AppConfig, StoreConfig } from '../config/AppConfig';

/**
 * Social Share Utility
 * Handles sharing app content to various platforms
 */
class SocialShare {
    private isEnabled(): boolean {
        return FeatureFlags.socialShare?.enabled ?? false;
    }

    /**
     * Get share message with app information
     */
    private getShareMessage(customMessage?: string): string {
        if (!this.isEnabled()) {
            return customMessage || '';
        }

        const defaultMessage = customMessage || FeatureFlags.socialShare?.shareMessage || 'Check out this amazing app!';
        const appName = FeatureFlags.socialShare?.shareAppName ? AppConfig.name : '';

        let message = defaultMessage;
        if (appName) {
            message = `${message}\n\n${appName}`;
        }

        if (FeatureFlags.socialShare?.shareAppStoreLinks) {
            const storeLink = Platform.OS === 'ios' 
                ? StoreConfig.ios.storeUrl 
                : StoreConfig.android.storeUrl;
            
            if (storeLink) {
                message = `${message}\n\n${storeLink}`;
            }
        }

        return message;
    }

    /**
     * Share using native share dialog
     */
    async share(message?: string, title?: string): Promise<boolean> {
        if (!this.isEnabled()) {
            return false;
        }

        try {
            const shareMessage = this.getShareMessage(message);
            const shareTitle = title || FeatureFlags.socialShare?.shareTitle || 'Share App';

            const result = await Share.share({
                message: shareMessage,
                title: shareTitle,
            }, {
                dialogTitle: shareTitle,
                excludedActivityTypes: this.getExcludedActivities(),
            });

            return result.action === Share.sharedAction;
        } catch (error: any) {
            console.error('Share error:', error);
            return false;
        }
    }

    /**
     * Share to WhatsApp
     */
    async shareToWhatsApp(message?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.socialShare?.platforms?.whatsapp) {
            return false;
        }

        try {
            const shareMessage = this.getShareMessage(message);
            const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
            const canOpen = await Linking.canOpenURL(url);
            
            if (canOpen) {
                await Linking.openURL(url);
                return true;
            } else {
                Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.');
                return false;
            }
        } catch (error) {
            console.error('WhatsApp share error:', error);
            return false;
        }
    }

    /**
     * Share to Facebook
     */
    async shareToFacebook(message?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.socialShare?.platforms?.facebook) {
            return false;
        }

        try {
            const shareMessage = this.getShareMessage(message);
            const storeLink = Platform.OS === 'ios' 
                ? StoreConfig.ios.storeUrl 
                : StoreConfig.android.storeUrl;
            
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeLink || '')}&quote=${encodeURIComponent(shareMessage)}`;
            const canOpen = await Linking.canOpenURL(url);
            
            if (canOpen) {
                await Linking.openURL(url);
                return true;
            } else {
                // Fallback to web
                await Linking.openURL(url);
                return true;
            }
        } catch (error) {
            console.error('Facebook share error:', error);
            return false;
        }
    }

    /**
     * Share to Twitter/X
     */
    async shareToTwitter(message?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.socialShare?.platforms?.twitter) {
            return false;
        }

        try {
            const shareMessage = this.getShareMessage(message);
            const storeLink = Platform.OS === 'ios' 
                ? StoreConfig.ios.storeUrl 
                : StoreConfig.android.storeUrl;
            
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(storeLink || '')}`;
            await Linking.openURL(url);
            return true;
        } catch (error) {
            console.error('Twitter share error:', error);
            return false;
        }
    }

    /**
     * Share via Email
     */
    async shareViaEmail(message?: string, subject?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.socialShare?.platforms?.email) {
            return false;
        }

        try {
            const shareMessage = this.getShareMessage(message);
            const emailSubject = subject || `Check out ${AppConfig.name}`;
            const storeLink = Platform.OS === 'ios' 
                ? StoreConfig.ios.storeUrl 
                : StoreConfig.android.storeUrl;
            
            const body = `${shareMessage}\n\n${storeLink || ''}`;
            const url = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
            
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
                return true;
            } else {
                Alert.alert('Email not configured', 'Please configure an email client.');
                return false;
            }
        } catch (error) {
            console.error('Email share error:', error);
            return false;
        }
    }

    /**
     * Share via SMS
     */
    async shareViaSMS(message?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.socialShare?.platforms?.sms) {
            return false;
        }

        try {
            const shareMessage = this.getShareMessage(message);
            const url = `sms:?body=${encodeURIComponent(shareMessage)}`;
            
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
                return true;
            } else {
                Alert.alert('SMS not available', 'SMS is not available on this device.');
                return false;
            }
        } catch (error) {
            console.error('SMS share error:', error);
            return false;
        }
    }

    /**
     * Copy to clipboard
     */
    async copyToClipboard(message?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.socialShare?.platforms?.clipboard) {
            return false;
        }

        try {
            // Try to use @react-native-clipboard/clipboard if available
            try {
                const Clipboard = require('@react-native-clipboard/clipboard').default;
                const shareMessage = this.getShareMessage(message);
                await Clipboard.setString(shareMessage);
                return true;
            } catch (clipboardError) {
                // Fallback: Use React Native's Clipboard API (deprecated but still works)
                const { Clipboard } = require('react-native');
                const shareMessage = this.getShareMessage(message);
                Clipboard.setString(shareMessage);
                return true;
            }
        } catch (error) {
            // Final fallback: use native share
            console.warn('Clipboard not available, using native share:', error);
            return this.share(message);
        }
    }

    /**
     * Get excluded activity types based on platform settings
     */
    private getExcludedActivities(): string[] {
        const excluded: string[] = [];

        if (!FeatureFlags.socialShare?.platforms?.whatsapp) {
            excluded.push('com.apple.UIKit.activity.PostToWeibo');
        }
        if (!FeatureFlags.socialShare?.platforms?.email) {
            excluded.push('com.apple.UIKit.activity.Mail');
        }
        if (!FeatureFlags.socialShare?.platforms?.sms) {
            excluded.push('com.apple.UIKit.activity.Message');
        }

        return excluded;
    }
}

export const socialShare = new SocialShare();
export default socialShare;

