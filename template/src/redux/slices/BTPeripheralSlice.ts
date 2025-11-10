import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BleManager from 'react-native-ble-manager';
import BTPeripheralModel from '../../models/BTPeripheralModel';

const scanForPeripheralsAction = createAsyncThunk(
  'BTPeripheralSlice/scanForPeripheralsAction',
  async (scanTime: number) => {
    await BleManager.scan([], scanTime, true);
  },
);

const stopScanAction = createAsyncThunk(
  'BTPeripheralSlice/stopScanAction',
  async () => {
    await BleManager.stopScan();
    var res = await BleManager.getDiscoveredPeripherals();
    return res;
  },
);

interface SampleState {
  scannedPeripherals: any;
  isConnected: boolean;
  connectionError: string;
}

const initialState: SampleState = {
  scannedPeripherals: [],
  isConnected: false,
  connectionError: '',
};

const BTPeripheralSlice = createSlice({
  name: 'BTPeripheral',
  initialState,
  reducers: {
    connectToScannedPeripheral: (state, action) => {
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
    builder.addCase(scanForPeripheralsAction.fulfilled, (state, action) => {});
    builder.addCase(stopScanAction.fulfilled, (state, action) => {
      let btPeripheralsList = [];

      for (var item of action.payload) {
        var btModel = new BTPeripheralModel();
        btModel.peripheralId = item?.id;
        btModel.rssi = item?.rssi;
        btPeripheralsList.push(btModel);
      }
      state.scannedPeripherals = [...btPeripheralsList];
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
