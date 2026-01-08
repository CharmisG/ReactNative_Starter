import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { wifiManager, WiFiNetwork } from '../../utils/WiFiManager';
import { FeatureFlags } from '../../config/AppConfig';

const scanForNetworksAction = createAsyncThunk(
  'WiFiSlice/scanForNetworksAction',
  async () => {
    if (!FeatureFlags.wifi?.enabled || !FeatureFlags.wifi?.features?.scanning) {
      throw new Error('WiFi scanning is disabled via FeatureFlags');
    }
    return await wifiManager.scanForNetworks();
  },
);

const connectToNetworkAction = createAsyncThunk(
  'WiFiSlice/connectToNetworkAction',
  async ({ ssid, password }: { ssid: string; password?: string }, { rejectWithValue }) => {
    if (!FeatureFlags.wifi?.enabled || !FeatureFlags.wifi?.features?.connecting) {
      return rejectWithValue('WiFi connection is disabled via FeatureFlags');
    }

    try {
      const result = await wifiManager.connectToNetwork(ssid, password);
      if (!result) {
        return rejectWithValue('Connection failed - check console for details');
      }
      return result;
    } catch (error: any) {
      const errorMsg = error?.message || String(error) || 'Unknown connection error';
      console.error('[WiFiSlice] Connection error:', errorMsg);
      return rejectWithValue(errorMsg);
    }
  },
);

const disconnectFromNetworkAction = createAsyncThunk(
  'WiFiSlice/disconnectFromNetworkAction',
  async () => {
    if (!FeatureFlags.wifi?.enabled || !FeatureFlags.wifi?.features?.disconnecting) {
      throw new Error('WiFi disconnection is disabled via FeatureFlags');
    }
    return await wifiManager.disconnectFromNetwork();
  },
);

const getWiFiStateAction = createAsyncThunk(
  'WiFiSlice/getWiFiStateAction',
  async () => {
    if (!FeatureFlags.wifi?.enabled) {
      return {
        isEnabled: false,
        isConnected: false,
      };
    }
    return await wifiManager.getWiFiState();
  },
);

interface WiFiState {
  scannedNetworks: WiFiNetwork[];
  isScanning: boolean;
  isConnected: boolean;
  connectedNetwork?: WiFiNetwork;
  isConnecting: boolean;
  error: string;
  wifiState: {
    isEnabled: boolean;
    isConnected: boolean;
    connectedNetwork?: WiFiNetwork;
    type?: string;
  };
}

const initialState: WiFiState = {
  scannedNetworks: [],
  isScanning: false,
  isConnected: false,
  isConnecting: false,
  error: '',
  wifiState: {
    isEnabled: false,
    isConnected: false,
  },
};

const WiFiSlice = createSlice({
  name: 'WiFi',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
    clearScannedNetworks: (state) => {
      state.scannedNetworks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanForNetworksAction.pending, (state) => {
        state.isScanning = true;
        state.error = '';
      })
      .addCase(scanForNetworksAction.fulfilled, (state, action) => {
        state.isScanning = false;
        state.scannedNetworks = action.payload;
      })
      .addCase(scanForNetworksAction.rejected, (state, action) => {
        state.isScanning = false;
        state.error = action.error.message || 'Failed to scan for networks';
      })
      .addCase(connectToNetworkAction.pending, (state) => {
        state.isConnecting = true;
        state.error = '';
      })
      .addCase(connectToNetworkAction.fulfilled, (state, action) => {
        state.isConnecting = false;
        if (action.payload) {
          state.isConnected = true;
          state.error = '';
        }
      })
      .addCase(connectToNetworkAction.rejected, (state, action) => {
        state.isConnecting = false;
        const errorMsg = typeof action.payload === 'string'
          ? action.payload
          : action.error.message || 'Failed to connect to network';
        state.error = errorMsg;
        console.error('[WiFiSlice] Connection rejected:', errorMsg);
      })
      .addCase(disconnectFromNetworkAction.fulfilled, (state, action) => {
        if (action.payload) {
          state.isConnected = false;
          state.connectedNetwork = undefined;
        }
      })
      .addCase(disconnectFromNetworkAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to disconnect from network';
      })
      .addCase(getWiFiStateAction.fulfilled, (state, action) => {
        state.wifiState = action.payload;
        state.isConnected = action.payload.isConnected;
        state.connectedNetwork = action.payload.connectedNetwork;
      });
  },
});

export const WiFiSliceActions = {
  ...WiFiSlice.actions,
  scanForNetworksAction,
  connectToNetworkAction,
  disconnectFromNetworkAction,
  getWiFiStateAction,
};

export default WiFiSlice.reducer;

