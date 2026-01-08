import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Translate from '../../hooks/Translate';
import { FeatureFlags } from '../../config/AppConfig';
import { windowHeight, windowWidth } from '../../styles/Dimens';
import Colors from '../../styles/Colors';
import { AppConstants } from '../../constants/AppConstants';
import { fontHeight } from '../../styles/Fonts';

const createBLEStyles = (appTheme: string) => {
    const isDark = appTheme === AppConstants.dark;

    return StyleSheet.create({
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
        buttonContainer: {
            flexDirection: 'row',
            gap: windowHeight(12),
            marginBottom: windowHeight(16),
        },
        button: {
            flex: 1,
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(14),
            borderRadius: windowHeight(10),
            alignItems: 'center',
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: windowHeight(3) },
            shadowOpacity: 0.25,
            shadowRadius: windowHeight(5),
            elevation: 4,
        },
        buttonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT15,
            fontWeight: '700',
        },
        peripheralCard: {
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
            padding: windowHeight(14),
            borderRadius: windowHeight(14),
            marginBottom: windowHeight(14),
            borderWidth: 1,
            borderColor: isDark ? Colors.grey : Colors.lightGrey,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: windowHeight(2) },
            shadowOpacity: isDark ? 0.22 : 0.1,
            shadowRadius: windowHeight(6),
            elevation: 3,
        },
        peripheralId: {
            fontSize: fontHeight.FONT16,
            fontWeight: '700',
            color: isDark ? Colors.white : Colors.charcoal,
            flex: 1,
        },
        connectButton: {
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(12),
            paddingHorizontal: windowWidth(24),
            borderRadius: windowHeight(12),
            minWidth: '100%',
            alignItems: 'center',
            marginTop: windowHeight(10),
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: windowHeight(2) },
            shadowOpacity: 0.22,
            shadowRadius: windowHeight(4),
            elevation: 3,
        },
        connectButtonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT15,
            fontWeight: '700',
            letterSpacing: 0.3,
        },
        disconnectButton: {
            backgroundColor: Colors.errorText,
        },
        emptyState: {
            padding: windowHeight(40),
            alignItems: 'center',
        },
        emptyStateText: {
            color: isDark ? Colors.accent : Colors.grey,
            fontSize: fontHeight.FONT15,
            textAlign: 'center',
        },
    });
};

const styles = StyleSheet.create({
    peripheralHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: windowHeight(8),
        gap: windowHeight(8),
    },
    rssiContainer: {
        backgroundColor: Colors.primary,
        paddingHorizontal: windowHeight(10),
        paddingVertical: windowHeight(6),
        borderRadius: windowHeight(10),
        marginRight: windowHeight(12),
        flexDirection: 'row',
        alignItems: 'center',
        gap: windowHeight(6),
    },
    rssiIndicator: {
        width: windowHeight(8),
        height: windowHeight(8),
        borderRadius: windowHeight(4),
        backgroundColor: Colors.white,
    },
    rssiText: {
        fontSize: fontHeight.FONT13,
        fontWeight: '700',
        color: Colors.white,
    },
});

interface BLESectionProps {
    isBLEEnabled: boolean;
    scannedPeripherals: any[];
    isConnected: boolean;
    isScanning: boolean;
    scanForPeripherals: () => void;
    connectToPeripheral: (id: string) => void;
    disconnect: (id: string) => void;
    appTheme?: string;
}

export const BLESection: React.FC<BLESectionProps> = ({
    isBLEEnabled,
    scannedPeripherals,
    isConnected,
    isScanning,
    scanForPeripherals,
    connectToPeripheral,
    disconnect,
    appTheme = AppConstants.light,
}) => {
    const themeStyles = useMemo(() => createBLEStyles(appTheme), [appTheme]);
    const renderPeripheralItem = useCallback(
        ({ item }: { item: any }) => (
            <View style={themeStyles.peripheralCard}>
                <View style={styles.peripheralHeader}>
                    <View style={styles.rssiContainer}>
                        <View style={styles.rssiIndicator} />
                        <Text style={styles.rssiText}>{item.rssi} dBm</Text>
                    </View>
                    <Text style={themeStyles.peripheralId} numberOfLines={1}>
                        {item.peripheralId}
                    </Text>
                </View>
                {FeatureFlags.bluetooth?.features?.connecting && (
                    <TouchableOpacity
                        style={[themeStyles.connectButton, isConnected && themeStyles.disconnectButton]}
                        onPress={() =>
                            isConnected ? disconnect(item.peripheralId) : connectToPeripheral(item.peripheralId)
                        }
                        activeOpacity={0.8}
                    >
                        <Text style={themeStyles.connectButtonText}>
                            {isConnected ? Translate('Disconnect') : Translate('Connect')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        ),
        [isConnected, disconnect, connectToPeripheral, themeStyles],
    );

    const keyExtractor = useCallback((item: any) => item.peripheralId, []);

    if (!isBLEEnabled) {
        return (
            <View style={themeStyles.errorContainer}>
                <Text style={themeStyles.errorText}>BLE functionality is disabled</Text>
            </View>
        );
    }

    return (
        <>
            {FeatureFlags.bluetooth?.features?.scanning && (
                <View style={themeStyles.buttonContainer}>
                    <TouchableOpacity
                        style={themeStyles.button}
                        onPress={scanForPeripherals}
                        activeOpacity={0.8}
                        disabled={isScanning}
                    >
                        <Text style={themeStyles.buttonText}>
                            {isScanning ? Translate('Scanning...') : Translate('Start Scan')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            {scannedPeripherals.length > 0 ? (
                <FlatList
                    data={scannedPeripherals}
                    keyExtractor={keyExtractor}
                    scrollEnabled={false}
                    renderItem={renderPeripheralItem}
                />
            ) : (
                <View style={themeStyles.emptyState}>
                    <Text style={themeStyles.emptyStateText}>
                        {Translate('No devices found')}. {Translate('Start Scan')} {Translate('to search for BLE devices')}.
                    </Text>
                </View>
            )}
        </>
    );
};

