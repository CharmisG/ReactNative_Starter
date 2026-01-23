import { Platform, PermissionsAndroid, Alert } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { FeatureFlags } from '../config/AppConfig';

export interface WiFiNetwork {
    ssid: string;
    bssid?: string;
    rssi?: number;
    security?: 'OPEN' | 'WPA' | 'WPA2' | 'WPA3' | 'WEP';
    frequency?: number;
    isConnected?: boolean;
}

export interface WiFiState {
    isEnabled: boolean;
    isConnected: boolean;
    connectedNetwork?: WiFiNetwork;
    type?: NetInfoStateType;
}

class WiFiManagerClass {
    private isEnabled(): boolean {
        return FeatureFlags.wifi?.enabled ?? false;
    }

    /**
     * Request necessary permissions for WiFi operations
     */
    async requestPermissions(): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.wifi?.requestPermissions) {
            return false;
        }

        if (Platform.OS === 'android') {
            try {
                const permissions: (typeof PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)[] = [];

                // Location permission is required for WiFi scanning on Android
                if (Platform.Version >= 23) {
                    permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                }

                if (permissions.length === 0) {
                    return true;
                }

                const granted = await PermissionsAndroid.requestMultiple(permissions as any);
                return Object.values(granted).every(
                    result => result === PermissionsAndroid.RESULTS.GRANTED,
                );
            } catch (error) {
                console.error('WiFi permission request failed:', error);
                return false;
            }
        }

        // iOS permissions are handled via Info.plist
        return true;
    }

    /**
     * Get current WiFi state
     */
    async getWiFiState(): Promise<WiFiState> {
        if (!this.isEnabled()) {
            return {
                isEnabled: false,
                isConnected: false,
            };
        }

        try {
            const state = await NetInfo.fetch();
            const isWiFi = state.type === 'wifi';
            const isConnected = !!(state.isConnected && isWiFi);
            let connectedNetwork: WiFiNetwork | undefined;
            if (isConnected && state.details) {
                const details = state.details as any;
                connectedNetwork = {
                    ssid: details.ssid || 'Unknown',
                    bssid: details.bssid,
                    isConnected: true,
                };
            }

            return {
                isEnabled: true,
                isConnected,
                connectedNetwork,
                type: state.type,
            };
        } catch (error) {
            console.error('Failed to get WiFi state:', error);
            return {
                isEnabled: false,
                isConnected: false,
            };
        }
    }

    /**
     * Scan for available WiFi networks
     * 
     * Note: iOS does not support WiFi scanning due to platform restrictions.
     * On Android, location services must be enabled for scanning to work.
     */
    async scanForNetworks(): Promise<WiFiNetwork[]> {
        if (!this.isEnabled() || !FeatureFlags.wifi?.features?.scanning) {
            return [];
        }

        // iOS doesn't support WiFi scanning
        if (Platform.OS === 'ios') {
            Alert.alert(
                'Not Supported',
                'WiFi scanning is not available on iOS due to platform restrictions. You can only connect to known networks.'
            );
            return [];
        }

        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                Alert.alert(
                    'Permission Required',
                    'Location permission is required for WiFi scanning. Please enable location services in your device settings.'
                );
                return [];
            }

            // Check if WiFi is enabled
            const isWiFiOn = await this.isWiFiEnabled();
            if (!isWiFiOn) {
                Alert.alert(
                    'WiFi Disabled',
                    'Please enable WiFi in your device settings to scan for networks.'
                );
                return [];
            }

            // Load WiFi list using react-native-wifi-reborn
            // Note: On Android 9+, there are limitations on scan frequency
            const networks = await WifiManager.loadWifiList();

            if (!networks || networks.length === 0) {
                Alert.alert(
                    'No Networks Found',
                    'No WiFi networks found. Make sure:\n' +
                    '1. WiFi is enabled\n' +
                    '2. Location services are enabled\n' +
                    '3. You are within range of WiFi networks\n' +
                    '4. Try scanning again (Android limits scan frequency)'
                );
                return [];
            }

            return networks.map((network: any) => ({
                ssid: network.SSID || network.ssid || 'Unknown',
                bssid: network.BSSID || network.bssid,
                rssi: network.level || network.rssi,
                security: this.parseSecurity(network.capabilities || network.security || ''),
                frequency: network.frequency,
                isConnected: network.isConnected || false,
            }));
        } catch (error: any) {
            console.error('WiFi scan failed:', error);
            const errorMessage = error?.message || 'Failed to scan for WiFi networks';

            // Provide more helpful error messages
            if (errorMessage.includes('location') || errorMessage.includes('permission')) {
                Alert.alert(
                    'Permission Error',
                    'Location permission is required for WiFi scanning. Please enable location services in your device settings.'
                );
            } else if (errorMessage.includes('WIFI_STATE')) {
                Alert.alert(
                    'WiFi Error',
                    'Please enable WiFi in your device settings.'
                );
            } else {
                Alert.alert('Scan Failed', errorMessage);
            }

            return [];
        }
    }

    /**
     * Connect to a WiFi network
     * 
     * Note: iOS has limitations - connection may not work on all iOS versions
     * Android requires location permission and WiFi to be enabled
     */
    async connectToNetwork(ssid: string, password?: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.wifi?.features?.connecting) {
            Alert.alert('WiFi Connection Disabled', 'WiFi connection is disabled via FeatureFlags');
            return false;
        }

        // iOS limitations warning
        if (Platform.OS === 'ios') {
            Alert.alert(
                'iOS Limitation',
                'WiFi connection on iOS has limitations. The network must be in range and you may need to connect manually from Settings for some networks.'
            );
        }

        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                Alert.alert('Permission Required', 'Location permission is required for WiFi connection. Please enable it in Settings.');
                return false;
            }

            // Check if WiFi is enabled
            const isWiFiOn = await this.isWiFiEnabled();
            if (!isWiFiOn) {
                Alert.alert('WiFi Disabled', 'Please enable WiFi in your device settings to connect.');
                return false;
            }

            console.log(`[WiFiManager] Attempting to connect to: ${ssid} (password: ${password ? 'provided' : 'none'})`);
            console.log(`[WiFiManager] Platform: ${Platform.OS}, Version: ${Platform.Version}`);

            if (password) {
                // Connect to protected network
                // connectToProtectedSSID(ssid, password, isWep, isHidden)
                try {
                    console.log(`[WiFiManager] Calling connectToProtectedSSID with: ssid=${ssid}, isWep=false, isHidden=false`);
                    await WifiManager.connectToProtectedSSID(ssid, password, false, false);
                    console.log(`[WiFiManager] Successfully connected to ${ssid}`);

                    // Wait a moment and verify connection
                    setTimeout(async () => {
                        const currentSSID = await this.getCurrentSSID();
                        if (currentSSID === ssid) {
                            Alert.alert('Connected', `Successfully connected to ${ssid}`);
                        }
                    }, 2000);

                    return true;
                } catch (connectError: any) {
                    console.error('[WiFiManager] Protected network connection error:', connectError);
                    console.error('[WiFiManager] Error details:', JSON.stringify(connectError, null, 2));

                    const errorMsg = connectError?.message || connectError?.toString() || String(connectError) || 'Unknown error';

                    // Provide more specific error messages
                    if (errorMsg.includes('password') || errorMsg.includes('authentication') || errorMsg.includes('wrong')) {
                        Alert.alert('Connection Failed', 'Incorrect password. Please check the password and try again.');
                    } else if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
                        Alert.alert('Connection Failed', 'Connection timeout. The network may be out of range, not responding, or the password is incorrect.');
                    } else if (errorMsg.includes('permission') || errorMsg.includes('location') || errorMsg.includes('ACCESS')) {
                        Alert.alert('Permission Error', 'Location permission is required. Please enable location services in Settings.');
                    } else if (errorMsg.includes('not found') || errorMsg.includes('unavailable')) {
                        Alert.alert('Network Not Found', 'The network is not available. Make sure you are within range and the network is broadcasting.');
                    } else if (errorMsg.includes('iOS') || errorMsg.includes('not supported')) {
                        Alert.alert('Not Supported', 'WiFi connection may not be fully supported on iOS. Try connecting manually from Settings.');
                    } else {
                        Alert.alert('Connection Failed', `Failed to connect: ${errorMsg}\n\nCheck console logs for details.`);
                    }
                    return false;
                }
            } else {
                // Connect to open network
                try {
                    console.log(`[WiFiManager] Calling connect for open network: ${ssid}`);

                    // connectToSSID is iOS-only, so on Android we use connectToProtectedSSID with empty password
                    if (Platform.OS === 'android') {
                        // Android: Use connectToProtectedSSID with empty string for open networks
                        console.log(`[WiFiManager] Android: Using connectToProtectedSSID with empty password`);
                        await WifiManager.connectToProtectedSSID(ssid, '', false, false);
                    } else {
                        // iOS: Use connectToSSID (iOS-only method)
                        // Check if method exists before calling
                        if (WifiManager.connectToSSID && typeof WifiManager.connectToSSID === 'function') {
                            console.log(`[WiFiManager] iOS: Using connectToSSID`);
                            await WifiManager.connectToSSID(ssid);
                        } else {
                            // Fallback: Use connectToProtectedSSID with empty password on iOS too
                            console.log(`[WiFiManager] iOS: connectToSSID not available, using connectToProtectedSSID`);
                            await WifiManager.connectToProtectedSSID(ssid, '', false, false);
                        }
                    }

                    console.log(`[WiFiManager] Successfully connected to ${ssid}`);

                    // Wait a moment and verify connection
                    setTimeout(async () => {
                        const currentSSID = await this.getCurrentSSID();
                        if (currentSSID === ssid) {
                            Alert.alert('Connected', `Successfully connected to ${ssid}`);
                        }
                    }, 2000);

                    return true;
                } catch (connectError: any) {
                    console.error('[WiFiManager] Open network connection error:', connectError);
                    console.error('[WiFiManager] Error details:', JSON.stringify(connectError, null, 2));

                    const errorMsg = connectError?.message || connectError?.toString() || String(connectError) || 'Unknown error';

                    if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
                        Alert.alert('Connection Failed', 'Connection timeout. The network may be out of range or not responding.');
                    } else if (errorMsg.includes('permission') || errorMsg.includes('location') || errorMsg.includes('ACCESS')) {
                        Alert.alert('Permission Error', 'Location permission is required. Please enable location services in Settings.');
                    } else if (errorMsg.includes('not found') || errorMsg.includes('unavailable')) {
                        Alert.alert('Network Not Found', 'The network is not available. Make sure you are within range.');
                    } else if (errorMsg.includes('iOS') || errorMsg.includes('not supported') || errorMsg.includes('not a function')) {
                        Alert.alert('Not Supported', 'WiFi connection may not be fully supported on this platform. Try connecting manually from Settings.');
                    } else {
                        Alert.alert('Connection Failed', `Failed to connect: ${errorMsg}\n\nCheck console logs for details.`);
                    }
                    return false;
                }
            }
        } catch (error: any) {
            console.error('[WiFiManager] WiFi connection failed:', error);
            console.error('[WiFiManager] Error details:', JSON.stringify(error, null, 2));
            const errorMsg = error?.message || error?.toString() || String(error) || 'Failed to connect to WiFi network';
            Alert.alert('Connection Failed', `${errorMsg}\n\nCheck console logs for detailed error information.`);
            return false;
        }
    }

    /**
     * Disconnect from current WiFi network
     */
    async disconnectFromNetwork(): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.wifi?.features?.disconnecting) {
            return false;
        }

        try {
            // Note: disconnect() may require different parameters on different platforms
            if (Platform.OS === 'android') {
                await WifiManager.disconnect();
                return true;
            } else {
                // iOS: Disconnect is not directly supported; show info but still return true so UI state clears.
                Alert.alert(
                    'Not Supported',
                    'WiFi disconnection is not fully supported on iOS. Please disconnect manually from Settings.'
                );
                return true;
            }
        } catch (error) {
            console.error('WiFi disconnection failed:', error);
            return false;
        }
    }

    /**
     * Get current connected network SSID
     */
    async getCurrentSSID(): Promise<string | null> {
        if (!this.isEnabled()) {
            return null;
        }

        try {
            const ssid = await WifiManager.getBSSID();
            return ssid;
        } catch (error) {
            console.error('Failed to get SSID:', error);
            return null;
        }
    }

    /**
     * Check if WiFi is enabled
     */
    async isWiFiEnabled(): Promise<boolean> {
        if (!this.isEnabled()) {
            return false;
        }

        try {
            if (Platform.OS === 'android') {
                return await WifiManager.isEnabled();
            }
            // iOS: Check via NetInfo
            const state = await NetInfo.fetch();
            return state.type === 'wifi';
        } catch (error) {
            console.error('Failed to check WiFi state:', error);
            return false;
        }
    }

    /**
     * Monitor WiFi state changes
     */
    subscribeToWiFiState(callback: (state: WiFiState) => void): () => void {
        if (!this.isEnabled() || !FeatureFlags.wifi?.features?.stateMonitoring) {
            return () => { };
        }

        const unsubscribe = NetInfo.addEventListener(async (state) => {
            const wifiState = await this.getWiFiState();
            callback(wifiState);
        });

        return unsubscribe;
    }

    /**
     * Get current network information
     */
    async getNetworkInfo(): Promise<{
        ssid?: string;
        bssid?: string;
        ipAddress?: string;
        subnetMask?: string;
        gateway?: string;
    }> {
        if (!this.isEnabled() || !FeatureFlags.wifi?.features?.networkInfo) {
            return {};
        }

        try {
            const state = await NetInfo.fetch();
            if (state.type === 'wifi' && state.details) {
                const details = state.details as any;
                return {
                    ssid: details.ssid,
                    bssid: details.bssid,
                    ipAddress: details.ipAddress,
                    subnetMask: details.subnetMask,
                    gateway: details.gateway,
                };
            }
            return {};
        } catch (error) {
            console.error('Failed to get network info:', error);
            return {};
        }
    }

    /**
     * Parse security type from capabilities string
     */
    private parseSecurity(capabilities: string): 'OPEN' | 'WPA' | 'WPA2' | 'WPA3' | 'WEP' {
        if (!capabilities) return 'OPEN';

        const caps = capabilities.toUpperCase();
        if (caps.includes('WPA3')) return 'WPA3';
        if (caps.includes('WPA2')) return 'WPA2';
        if (caps.includes('WPA')) return 'WPA';
        if (caps.includes('WEP')) return 'WEP';
        return 'OPEN';
    }
}

export const wifiManager = new WiFiManagerClass();
export default wifiManager;

