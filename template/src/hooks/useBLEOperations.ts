import { useCallback, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
    BTPeripheralSliceActions,
    connectToScannedPeripheral,
    disconnectFromPeripheral,
} from '../redux/slices/BTPeripheralSlice';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { BluetoothState } from '../constants/AppConstants';
import { FeatureFlags } from '../config/AppConfig';
import BleManager from 'react-native-ble-manager';

export const useBLEOperations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { scannedPeripherals, isConnected, isScanning } = useSelector(
        (state: RootState) => state.Peripherals,
    );
    const isBLEEnabled = FeatureFlags.bluetooth?.enabled ?? false;

    const requestBluetoothPermissions = useCallback(async () => {
        if (Platform.OS === 'android') {
            const permissions: (typeof PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)[] = [];
            if (Platform.Version >= 23 && Platform.Version <= 30) {
                permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            } else if (Platform.Version >= 31) {
                permissions.push(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                );
            }
            if (permissions.length === 0) return true;
            const granted = await PermissionsAndroid.requestMultiple(permissions as any);
            return Object.values(granted).every(
                result => result === PermissionsAndroid.RESULTS.GRANTED,
            );
        }
        return true;
    }, []);

    const scanForPeripherals = useCallback(() => {
        if (!isBLEEnabled || !FeatureFlags.bluetooth?.features?.scanning) {
            Alert.alert('', 'BLE scanning is disabled');
            return;
        }
        BluetoothStateManager.getState().then(bluetoothState => {
            if (bluetoothState === BluetoothState.PoweredOff || bluetoothState === BluetoothState.Unknown) {
                Alert.alert('', 'Please turn on the bluetooth from your device settings');
            } else {
                const scanDuration = FeatureFlags.bluetooth?.scanDuration || 5;
                dispatch(BTPeripheralSliceActions.scanForPeripheralsAction(scanDuration));
            }
        });
    }, [isBLEEnabled, dispatch]);

    const stopScan = useCallback(() => {
        if (isBLEEnabled && FeatureFlags.bluetooth?.features?.scanning) {
            dispatch(BTPeripheralSliceActions.stopScanAction());
        }
    }, [isBLEEnabled, dispatch]);

    const connectToPeripheral = useCallback(
        (scannedPer: string) => {
            if (!isBLEEnabled || !FeatureFlags.bluetooth?.features?.connecting) {
                Alert.alert('', 'BLE connection is disabled');
                return;
            }
            dispatch(connectToScannedPeripheral(scannedPer));
        },
        [isBLEEnabled, dispatch],
    );

    const disconnect = useCallback(
        (peripheralId: string) => {
            if (!isBLEEnabled || !FeatureFlags.bluetooth?.features?.disconnecting) {
                Alert.alert('', 'BLE disconnection is disabled');
                return;
            }
            dispatch(disconnectFromPeripheral(peripheralId));
        },
        [isBLEEnabled, dispatch],
    );

    useEffect(() => {
        if (!isBLEEnabled) return;
        if (FeatureFlags.bluetooth?.requestPermissions) {
            requestBluetoothPermissions();
        }
        if (FeatureFlags.bluetooth?.autoStart) {
            BleManager.start({ showAlert: FeatureFlags.bluetooth?.showAlert ?? false });
        }
    }, [isBLEEnabled, requestBluetoothPermissions]);

    return {
        scannedPeripherals,
        isConnected,
        isBLEEnabled,
        isScanning,
        scanForPeripherals,
        connectToPeripheral,
        disconnect,
    };
};

