import { Text, View, SafeAreaView, Button, FlatList, Alert, Platform, PermissionsAndroid } from 'react-native';
import Navbar from '../components/Navbar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { useEffect, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  BTPeripheralSliceActions,
  connectToScannedPeripheral,
  disconnectFromPeripheral,
} from '../redux/slices/BTPeripheralSlice';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { BluetoothState } from '../constants/AppConstants';
import Translate from '../hooks/Translate';
import { windowHeight } from '../styles/Dimens';

type Props = NativeStackScreenProps<RootStackParamList, 'ScreenTwo'>;

const ScreenTwo = ({ navigation }: Props) => {
  let rightIconView = <Text>|||</Text>;
  const dispatch = useDispatch<AppDispatch>();
  const { scannedPeripherals, isConnected } = useSelector(
    (state: RootState) => state.Peripherals,
  );

  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  function scanForPeripherals() {
    BluetoothStateManager.getState().then(bluetoothState => {
      if (
        bluetoothState === BluetoothState.PoweredOff ||
        bluetoothState === BluetoothState.Unknown
      ) {
        Alert.alert(
          '',
          'Please turn on the bluetooth from your device settings',
        );
      } else {
        dispatch(BTPeripheralSliceActions.scanForPeripheralsAction(5));
      }
    });
  }

  function stopScan() {
    dispatch(BTPeripheralSliceActions.stopScanAction());
  }

  function connectToPeripheral(scannedPer: string) {
    dispatch(connectToScannedPeripheral(scannedPer));
  }

  function disconnect(peripheralId: string) {
    dispatch(disconnectFromPeripheral(peripheralId));
  }

  useEffect(() => {
    requestBluetoothPermissions()
    // Device bluetooth should be switched on before this could work
    BleManager.start({ showAlert: false });
  }, []);

  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android') {
      const permissions = [];
      if (Platform.Version >= 23 && Platform.Version <= 30) {
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      } else if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
      }

      if (permissions.length === 0) {
        return true;
      }
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      return Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
    return true;
  }

  useEffect(() => {
    setIsDeviceConnected(isConnected);
  }, [isConnected]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar
        screenTitle={Translate('Screen Two')}
        rightIcon={rightIconView}
        leftIconPressed={() => navigation.goBack()}
      />
      <View style={{ flex: 1, alignItems: 'stretch', padding: 10 }}>
        <Text>{Translate('This is Screen Two')}</Text>
        <Button title={Translate("Start Scan")} onPress={scanForPeripherals}></Button>
        <Button title={Translate("Stop scan")} onPress={stopScan}></Button>
        <FlatList
          data={scannedPeripherals}
          keyExtractor={item => item.peripheralId}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: windowHeight(10) }}>
              <Text>{item.peripheralId}</Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{item.rssi}</Text>
                <Button
                  title={Translate('Connect')}
                  onPress={() =>
                    isDeviceConnected
                      ? disconnect(item.peripheralId)
                      : connectToPeripheral(item.peripheralId)
                  }></Button>
              </View>
            </View>
          )}
        />
        <Button
          title={Translate("Navigate")}
          onPress={() => navigation.navigate('ScreenThree')}></Button>
      </View>
    </SafeAreaView>
  );
};

export default ScreenTwo;
