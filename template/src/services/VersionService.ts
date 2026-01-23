import { Platform, Linking } from 'react-native';
import { AppConfig, StoreConfig, DebugConfig, UrlConstants } from '../config/AppConfig';

export interface VersionInfo {
    currentVersion: string;
    latestVersion: string;
    isUpdateAvailable: boolean;
    isForceUpdate: boolean;
    updateMessage?: string;
    updateUrl?: string;
}

class VersionService {
    private static instance: VersionService;
    private currentVersion: string;
    private appStoreUrl: string;
    private playStoreUrl: string;

    private constructor() {
        this.currentVersion = AppConfig.version;
        this.appStoreUrl = StoreConfig.ios.storeUrl;
        this.playStoreUrl = StoreConfig.android.storeUrl;
        this.initializeVersion();
    }

    static getInstance(): VersionService {
        if (!VersionService.instance) {
            VersionService.instance = new VersionService();
        }
        return VersionService.instance;
    }

    private initializeVersion(): void {
        this.currentVersion = AppConfig.version;
        if (DebugConfig.logging) {
            console.log('[VersionService] Initialized with version:', this.currentVersion);
        }
    }

    /**
     * Get current app version
     */
    getCurrentVersion(): string {
        return this.currentVersion;
    }

    /**
     * Check version from remote API using AppConfig
     */
    async checkForUpdates(): Promise<VersionInfo> {
        try {
            // Check if mock mode is enabled for testing
            if (DebugConfig.mockVersionUpdate.enabled) {
                return {
                    currentVersion: this.currentVersion,
                    latestVersion: DebugConfig.mockVersionUpdate.latestVersion,
                    isUpdateAvailable: true,
                    isForceUpdate: DebugConfig.mockVersionUpdate.forceUpdate,
                    updateMessage: 'Mock update (testing mode)',
                    updateUrl: Platform.OS === 'ios' ? this.appStoreUrl : this.playStoreUrl,
                };
            }

            if (DebugConfig.logApiCalls) {
                console.log('[VersionService] Checking for updates from:', `${UrlConstants.baseUrl}api/version`);
            }

            // Use UrlConstants for API endpoint
            const response = await fetch(`${UrlConstants.baseUrl}api/version`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            const isUpdateAvailable = this.compareVersions(
                this.currentVersion,
                data.latestVersion
            );

            if (DebugConfig.logApiCalls) {
                console.log('[VersionService] Update check result:', {
                    latestVersion: data.latestVersion,
                    isUpdateAvailable,
                    isForceUpdate: data.isForceUpdate,
                });
            }

            return {
                currentVersion: this.currentVersion,
                latestVersion: data.latestVersion,
                isUpdateAvailable,
                isForceUpdate: data.isForceUpdate || false,
                updateMessage: data.message || 'A new version is available. Please update to get the latest features.',
                updateUrl: Platform.OS === 'ios' ? this.appStoreUrl : this.playStoreUrl,
            };
        } catch (error) {
            if (DebugConfig.logging) {
                console.warn('[VersionService] Version check failed', error);
            }
            return {
                currentVersion: this.currentVersion,
                latestVersion: this.currentVersion,
                isUpdateAvailable: false,
                isForceUpdate: false,
            };
        }
    }

    /**
     * Compare semantic versions
     * Returns true if latestVersion > currentVersion
     */
    private compareVersions(current: string, latest: string): boolean {
        try {
            const currentParts = current.split('.').map(Number);
            const latestParts = latest.split('.').map(Number);

            for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
                const curr = currentParts[i] || 0;
                const newVer = latestParts[i] || 0;

                if (newVer > curr) return true;
                if (newVer < curr) return false;
            }

            if (DebugConfig.logApiCalls) {
                console.log(`[VersionService] Version comparison: ${current} vs ${latest} = equal`);
            }
            return false;
        } catch (error) {
            if (DebugConfig.logging) {
                console.warn('[VersionService] Version comparison failed', error);
            }
            return false;
        }
    }

    /**
     * Open app store/play store for update
     */
    async openUpdateUrl(url: string): Promise<void> {
        try {
            if (DebugConfig.logging) {
                console.log('[VersionService] Opening store URL:', url);
            }
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                console.warn('[VersionService] Cannot open URL:', url);
            }
        } catch (error) {
            console.error('[VersionService] Failed to open update URL', error);
        }
    }

    /**
     * Get store URL based on platform
     */
    getStoreUrl(): string {
        return Platform.OS === 'ios' ? this.appStoreUrl : this.playStoreUrl;
    }

    /**
     * Set custom store URLs
     */
    setStoreUrls(iosUrl: string, androidUrl: string): void {
        this.appStoreUrl = iosUrl;
        this.playStoreUrl = androidUrl;
    }
}

export default VersionService.getInstance();
