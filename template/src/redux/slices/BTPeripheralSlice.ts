import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BleManager from 'react-native-ble-manager';
import BTPeripheralModel from '../../models/BTPeripheralModel';
import { FeatureFlags } from '../../config/AppConfig';

const scanForPeripheralsAction = createAsyncThunk(
  'BTPeripheralSlice/scanForPeripheralsAction',
  async (scanTime: number) => {
    if (!FeatureFlags.bluetooth?.enabled || !FeatureFlags.bluetooth?.features?.scanning) {
      throw new Error('BLE scanning is disabled via FeatureFlags');
    }
    // Start scan, wait for completion, then fetch discovered peripherals
    await BleManager.scan([], scanTime, true);
    await new Promise(resolve => setTimeout(resolve, Math.max(scanTime * 1000, 1500)));
    const peripherals = await BleManager.getDiscoveredPeripherals();
    return peripherals;
  },
);

const stopScanAction = createAsyncThunk(
  'BTPeripheralSlice/stopScanAction',
  async () => {
    if (!FeatureFlags.bluetooth?.enabled || !FeatureFlags.bluetooth?.features?.scanning) {
      return [];
    }
    await BleManager.stopScan();
    const res = await BleManager.getDiscoveredPeripherals();
    return res;
  },
);

interface SampleState {
  scannedPeripherals: any;
  isConnected: boolean;
  connectionError: string;
  isScanning: boolean;
}

const initialState: SampleState = {
  scannedPeripherals: [],
  isConnected: false,
  connectionError: '',
  isScanning: false,
};

const BTPeripheralSlice = createSlice({
  name: 'BTPeripheral',
  initialState,
  reducers: {
    connectToScannedPeripheral: (state, action) => {
      if (!FeatureFlags.bluetooth?.enabled || !FeatureFlags.bluetooth?.features?.connecting) {
        state.connectionError = 'BLE connection is disabled via FeatureFlags';
        return;
      }
      BleManager.connect(action.payload)
        .then(() => {
          state.isConnected = true;
        })
        .catch(error => {
          state.connectionError =
            'Error connecting to peripheral. Please try again.';
        });
    },
    disconnectFromPeripheral: (state, action) => {
      if (!FeatureFlags.bluetooth?.enabled || !FeatureFlags.bluetooth?.features?.disconnecting) {
        state.connectionError = 'BLE disconnection is disabled via FeatureFlags';
        return;
      }
      BleManager.disconnect(action.payload)
        .then(() => {
          state.isConnected = false;
        })
        .catch(error => {
          state.connectionError =
            'Error disconnecting from peripheral. Please try again.';
        });
    },
  },
  extraReducers: builder => {
    const updateList = (state: SampleState, action: any) => {
      const btPeripheralsList: BTPeripheralModel[] = [];
      for (const item of action.payload || []) {
        const btModel = new BTPeripheralModel();
        btModel.peripheralId = item?.id;
        btModel.rssi = item?.rssi;
        btPeripheralsList.push(btModel);
      }
      state.scannedPeripherals = btPeripheralsList;
      state.isScanning = false;
    };

    builder
      .addCase(scanForPeripheralsAction.pending, (state) => {
        state.isScanning = true;
        state.connectionError = '';
      })
      .addCase(scanForPeripheralsAction.fulfilled, updateList)
      .addCase(scanForPeripheralsAction.rejected, (state, action) => {
        state.isScanning = false;
        state.connectionError = action.error.message || 'Scan failed';
      })
      .addCase(stopScanAction.pending, (state) => {
        state.isScanning = true;
      })
      .addCase(stopScanAction.fulfilled, updateList)
      .addCase(stopScanAction.rejected, (state, action) => {
        state.isScanning = false;
        state.connectionError = action.error.message || 'Stop scan failed';
      });
  },
});

export const BTPeripheralSliceActions = {
  ...BTPeripheralSlice.actions,
  scanForPeripheralsAction,
  stopScanAction,
};
export const connectToScannedPeripheral =
  BTPeripheralSlice.actions.connectToScannedPeripheral;
export const disconnectFromPeripheral =
  BTPeripheralSlice.actions.disconnectFromPeripheral;
export default BTPeripheralSlice.reducer;
