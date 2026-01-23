import { useEffect, useState } from 'react';
import { wifiManager, WiFiState } from '../utils/WiFiManager';
import { FeatureFlags } from '../config/AppConfig';

/**
 * Hook for real-time WiFi state monitoring
 */
export const useWiFiMonitoring = () => {
  const [wifiState, setWifiState] = useState<WiFiState>({
    isEnabled: false,
    isConnected: false,
  });

  useEffect(() => {
    if (!FeatureFlags.wifi?.enabled || !FeatureFlags.wifi?.features?.stateMonitoring) {
      return;
    }

    // Get initial state
    wifiManager.getWiFiState().then(setWifiState);

    // Subscribe to changes
    const unsubscribe = wifiManager.subscribeToWiFiState((state) => {
      setWifiState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return wifiState;
};

