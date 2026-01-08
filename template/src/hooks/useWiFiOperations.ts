import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { WiFiSliceActions } from '../redux/slices/WiFiSlice';
import { FeatureFlags } from '../config/AppConfig';
import { useWiFiMonitoring } from './useWiFiMonitoring';

export const useWiFiOperations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const wifiState = useSelector((state: RootState) => state.WiFi);
    const realTimeWiFiState = useWiFiMonitoring();
    const isWiFiEnabled = FeatureFlags.wifi?.enabled ?? false;

    const [selectedWiFiSSID, setSelectedWiFiSSID] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [networkToConnect, setNetworkToConnect] = useState<string | null>(null);
    const [wifiPassword, setWifiPassword] = useState('');

    const currentWiFiNetwork = useMemo(
        () => realTimeWiFiState.connectedNetwork || wifiState.wifiState.connectedNetwork,
        [realTimeWiFiState.connectedNetwork, wifiState.wifiState.connectedNetwork],
    );
    const isWiFiConnected = useMemo(
        () => realTimeWiFiState.isConnected || wifiState.wifiState.isConnected,
        [realTimeWiFiState.isConnected, wifiState.wifiState.isConnected],
    );

    const scanForWiFiNetworks = useCallback(() => {
        if (!isWiFiEnabled || !FeatureFlags.wifi?.features?.scanning) {
            Alert.alert('', 'WiFi scanning is disabled');
            return;
        }
        dispatch(WiFiSliceActions.scanForNetworksAction());
    }, [isWiFiEnabled, dispatch]);

    const connectToWiFiNetwork = useCallback(
        (ssid: string) => {
            if (!isWiFiEnabled || !FeatureFlags.wifi?.features?.connecting) {
                Alert.alert('', 'WiFi connection is disabled');
                return;
            }
            setSelectedWiFiSSID(ssid);
            const network = wifiState.scannedNetworks.find(n => n.ssid === ssid);
            if (network?.security === 'OPEN') {
                dispatch(WiFiSliceActions.connectToNetworkAction({ ssid }));
            } else {
                setNetworkToConnect(ssid);
                setShowPasswordModal(true);
            }
        },
        [isWiFiEnabled, wifiState.scannedNetworks, dispatch],
    );

    const handleConnectWithPassword = useCallback(() => {
        if (networkToConnect && wifiPassword) {
            dispatch(
                WiFiSliceActions.connectToNetworkAction({
                    ssid: networkToConnect,
                    password: wifiPassword,
                }),
            );
            setShowPasswordModal(false);
            setWifiPassword('');
            setNetworkToConnect(null);
        }
    }, [networkToConnect, wifiPassword, dispatch]);

    const disconnectFromWiFi = useCallback(() => {
        if (!isWiFiEnabled || !FeatureFlags.wifi?.features?.disconnecting) {
            Alert.alert('', 'WiFi disconnection is disabled');
            return;
        }
        dispatch(WiFiSliceActions.disconnectFromNetworkAction());
    }, [isWiFiEnabled, dispatch]);

    const closePasswordModal = useCallback(() => {
        setShowPasswordModal(false);
        setWifiPassword('');
        setNetworkToConnect(null);
    }, []);

    useEffect(() => {
        if (!isWiFiEnabled) return;
        dispatch(WiFiSliceActions.getWiFiStateAction());
        if (FeatureFlags.wifi?.autoScan) {
            scanForWiFiNetworks();
        }
    }, [isWiFiEnabled, dispatch, scanForWiFiNetworks]);

    return {
        wifiState,
        isWiFiEnabled,
        isWiFiConnected,
        currentWiFiNetwork,
        selectedWiFiSSID,
        showPasswordModal,
        networkToConnect,
        wifiPassword,
        setWifiPassword,
        scanForWiFiNetworks,
        connectToWiFiNetwork,
        handleConnectWithPassword,
        disconnectFromWiFi,
        closePasswordModal,
    };
};

