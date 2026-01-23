import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FeatureFlags } from '../../config/AppConfig';
import { windowHeight, windowWidth } from '../../styles/Dimens';
import Colors from '../../styles/Colors';
import Translate from '../../hooks/Translate';
import { AppConstants } from '../../constants/AppConstants';
import { fontHeight } from '../../styles/Fonts';

const styles = StyleSheet.create({
    errorContainer: {
        padding: windowHeight(16),
        backgroundColor: Colors.errorBackground,
        borderRadius: 12,
        marginVertical: windowHeight(12),
        borderWidth: 1,
        borderColor: Colors.errorBackground,
        borderLeftWidth: 4,
        borderLeftColor: Colors.errorText,
    },
    errorText: { color: Colors.errorText, fontWeight: '600', fontSize: fontHeight.FONT15 },
    connectedContainer: {
        padding: windowHeight(16),
        borderRadius: windowHeight(6),
        marginVertical: windowHeight(12),
        shadowColor: Colors.black,
        shadowRadius: windowHeight(4),
        elevation: 1,
    },
    connectedTitle: {
        fontWeight: '700',
        marginBottom: 8,
        fontSize: fontHeight.FONT16,
        color: Colors.primary,
    },
    scanButton: {
        backgroundColor: Colors.primary,
        paddingVertical: windowHeight(14),
        borderRadius: windowHeight(10),
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: windowHeight(5),
        elevation: 4,
    },
    scanButtonDisabled: {
        backgroundColor: Colors.lightGrey,
        shadowOpacity: 0,
    },
    scanButtonText: {
        fontSize: fontHeight.FONT16,
        fontWeight: '700',
    },
    networkListContainer: { marginTop: 8 },
    networkItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    networkInfo: { flex: 1, marginRight: windowHeight(12) },
    networkNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: windowHeight(8),
        marginBottom: windowHeight(4),
    },
    securityIndicator: {
        width: windowHeight(8),
        height: windowHeight(8),
        borderRadius: windowHeight(4),
    },
    securityIndicatorOpen: {
        backgroundColor: Colors.primary,
    },
    securityIndicatorSecured: {
        backgroundColor: Colors.primary,
    },
    networkName: {
        fontWeight: '700',
    },
    connectButton: {
        backgroundColor: Colors.primary,
        paddingVertical: windowHeight(10),
        paddingHorizontal: windowWidth(20),
        borderRadius: windowHeight(8),
        minWidth: windowWidth(100),
        alignItems: 'center',
    },
    connectButtonDisabled: {
        backgroundColor: Colors.lightGrey,
    },
    connectButtonText: {
        color: Colors.white,
        fontSize: fontHeight.FONT14,
        fontWeight: '700',
    },
    emptyState: {
        padding: windowHeight(40),
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: windowHeight(12),
        marginTop: windowHeight(12),
    },
    disconnectButton: {
        backgroundColor: Colors.errorText,
        paddingVertical: windowHeight(10),
        paddingHorizontal: windowWidth(20),
        borderRadius: windowHeight(8),
        marginTop: windowHeight(8),
        alignItems: 'center',
    },
    disconnectButtonText: {
        color: Colors.white,
        fontSize: fontHeight.FONT14,
        fontWeight: '700',
    },
});

const createWiFiStyles = (appTheme: string) => {
    const isDark = appTheme === AppConstants.dark;

    return StyleSheet.create({
        networkCard: {
            backgroundColor: isDark ? '#1e293b' : Colors.white,
            padding: windowHeight(16),
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#e2e8f0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.06,
            shadowRadius: 4,
            elevation: 2,
        },
        networkName: {
            fontWeight: '700',
            fontSize: fontHeight.FONT16,
            color: isDark ? '#f1f5f9' : '#1e293b',
            marginBottom: 4,
        },
        networkDetails: {
            fontSize: fontHeight.FONT13,
            color: isDark ? '#94a3b8' : '#64748b',
        },
        networkListTitle: {
            fontWeight: '700',
            marginBottom: windowHeight(12),
            fontSize: fontHeight.FONT18,
            color: isDark ? Colors.white : Colors.charcoal,
        },
        connectedSSID: {
            fontSize: fontHeight.FONT15,
            color: isDark ? Colors.white : Colors.charcoal,
            marginBottom: windowHeight(12),
            fontWeight: '600',
        },
        emptyStateText: {
            color: isDark ? Colors.accent : Colors.grey,
            fontSize: fontHeight.FONT15,
            textAlign: 'center',
        },
    });
};

interface WiFiSectionProps {
    isWiFiEnabled: boolean;
    wifiState: any;
    isWiFiConnected: boolean;
    currentWiFiNetwork: any;
    selectedWiFiSSID: string | null;
    scanForWiFiNetworks: () => void;
    connectToWiFiNetwork: (ssid: string) => void;
    disconnectFromWiFi: () => void;
    appTheme?: string;
}

export const WiFiSection: React.FC<WiFiSectionProps> = ({
    isWiFiEnabled,
    wifiState,
    isWiFiConnected,
    currentWiFiNetwork,
    selectedWiFiSSID,
    scanForWiFiNetworks,
    connectToWiFiNetwork,
    disconnectFromWiFi,
    appTheme = AppConstants.light,
}) => {
    const themeStyles = useMemo(() => createWiFiStyles(appTheme), [appTheme]);
    const renderWiFiNetworkItem = useCallback(
        ({ item }: { item: any }) => {
            const isConnecting = wifiState.isConnecting && selectedWiFiSSID === item.ssid;
            const isOpen = item.security === 'OPEN';
            return (
                <View style={themeStyles.networkCard}>
                    <View style={styles.networkItemContent}>
                        <View style={styles.networkInfo}>
                            <View style={styles.networkNameRow}>
                                <View
                                    style={[
                                        styles.securityIndicator,
                                        isOpen
                                            ? styles.securityIndicatorOpen
                                            : styles.securityIndicatorSecured,
                                    ]}
                                />
                                <Text style={themeStyles.networkName}>{item.ssid}</Text>
                            </View>
                            <Text style={themeStyles.networkDetails}>
                                {item.security} {item.rssi ? `• ${item.rssi} dBm` : ''}
                            </Text>
                        </View>
                        {FeatureFlags.wifi?.features?.connecting && (
                            <TouchableOpacity
                                style={[
                                    styles.connectButton,
                                    isConnecting && styles.connectButtonDisabled,
                                ]}
                                onPress={() => connectToWiFiNetwork(item.ssid)}
                                disabled={wifiState.isConnecting}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.connectButtonText}>
                                    {isConnecting ? Translate('Connecting...') : Translate('Connect')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            );
        },
        [wifiState.isConnecting, selectedWiFiSSID, connectToWiFiNetwork, themeStyles],
    );

    const keyExtractor = useCallback((item: any, index: number) => `${item.ssid}-${index}`, []);

    if (!isWiFiEnabled) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>WiFi functionality is disabled</Text>
            </View>
        );
    }

    return (
        <>
            {FeatureFlags.wifi?.features?.networkInfo && isWiFiConnected && (
                <View style={styles.connectedContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' }} />
                        <Text style={styles.connectedTitle}>{Translate('Connected Network')}:</Text>
                    </View>
                    <Text style={themeStyles.connectedSSID}>
                        {currentWiFiNetwork?.ssid || 'Unknown'}
                    </Text>
                    {FeatureFlags.wifi?.features?.disconnecting && (
                        <TouchableOpacity
                            style={styles.disconnectButton}
                            onPress={disconnectFromWiFi}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.disconnectButtonText}>{Translate('Disconnect')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {FeatureFlags.wifi?.features?.scanning && (
                <TouchableOpacity
                    style={[styles.scanButton, wifiState.isScanning && styles.scanButtonDisabled]}
                    onPress={scanForWiFiNetworks}
                    disabled={wifiState.isScanning}
                    activeOpacity={0.8}
                >
                    <Text style={styles.scanButtonText}>
                        {wifiState.isScanning ? Translate('Scanning...') : Translate('Scan for Networks')}
                    </Text>
                </TouchableOpacity>
            )}
            {wifiState.scannedNetworks.length > 0 && (
                <View style={styles.networkListContainer}>
                    <Text style={themeStyles.networkListTitle}>{Translate('Available Networks')}:</Text>
                    <FlatList
                        data={wifiState.scannedNetworks}
                        keyExtractor={keyExtractor}
                        scrollEnabled={false}
                        renderItem={renderWiFiNetworkItem}
                    />
                </View>
            )}
            {!wifiState.isScanning && wifiState.scannedNetworks.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={themeStyles.emptyStateText}>
                        {Translate('No networks found')}. {Translate('Scan for Networks')} {Translate('to search')}.
                    </Text>
                </View>
            )}
        </>
    );
};

