import React, { useState, useMemo } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import Translate from '../hooks/Translate';
import { FeatureFlags } from '../config/AppConfig';
import { useBLEOperations } from '../hooks/useBLEOperations';
import { useWiFiOperations } from '../hooks/useWiFiOperations';
import { BLESection } from '../components/screenTwo/BLESection';
import { WiFiSection } from '../components/screenTwo/WiFiSection';
import { WiFiPasswordModal } from '../components/screenTwo/WiFiPasswordModal';
import { RootState } from '../redux/store';
import { createScreenTwoStyles } from '../components/screenTwo/ScreenTwoStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'ScreenTwo'>;

const ScreenTwo = ({ navigation }: Props) => {
  const [selectedTab, setSelectedTab] = useState<'BLE' | 'WiFi'>('BLE');
  const { appTheme } = useSelector((state: RootState) => state.Settings);
  const ble = useBLEOperations();
  const wifi = useWiFiOperations();
  const isBLEEnabled = FeatureFlags.bluetooth?.enabled ?? false;
  const isWiFiEnabled = FeatureFlags.wifi?.enabled ?? false;

  const styles = useMemo(() => createScreenTwoStyles(appTheme), [appTheme]);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar
        screenTitle={Translate('Screen Two')}
        rightIcon={<Text>|||</Text>}
        leftIconPressed={navigation.goBack}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {(isBLEEnabled || isWiFiEnabled) && (
          <View style={styles.tabContainer}>
            {isBLEEnabled && (
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'BLE' && styles.tabActive]}
                onPress={() => setSelectedTab('BLE')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.tabIndicator,
                    selectedTab === 'BLE' && styles.tabIndicatorActive,
                  ]}
                />
                <Text style={[styles.tabText, selectedTab === 'BLE' && styles.tabTextActive]}>
                  {Translate('BLE')}
                </Text>
              </TouchableOpacity>
            )}
            {isWiFiEnabled && (
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'WiFi' && styles.tabActive]}
                onPress={() => setSelectedTab('WiFi')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.tabIndicator,
                    styles.tabIndicatorWiFi,
                    selectedTab === 'WiFi' && styles.tabIndicatorActive,
                  ]}
                />
                <Text style={[styles.tabText, selectedTab === 'WiFi' && styles.tabTextActive]}>
                  {Translate('WiFi')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {selectedTab === 'BLE' && (
          <BLESection
            isBLEEnabled={ble.isBLEEnabled}
            scannedPeripherals={ble.scannedPeripherals}
            isConnected={ble.isConnected}
            isScanning={ble.isScanning}
            scanForPeripherals={ble.scanForPeripherals}
            connectToPeripheral={ble.connectToPeripheral}
            disconnect={ble.disconnect}
            appTheme={appTheme}
          />
        )}
        {selectedTab === 'WiFi' && (
          <WiFiSection
            isWiFiEnabled={wifi.isWiFiEnabled}
            wifiState={wifi.wifiState}
            isWiFiConnected={wifi.isWiFiConnected}
            currentWiFiNetwork={wifi.currentWiFiNetwork}
            selectedWiFiSSID={wifi.selectedWiFiSSID}
            scanForWiFiNetworks={wifi.scanForWiFiNetworks}
            connectToWiFiNetwork={wifi.connectToWiFiNetwork}
            disconnectFromWiFi={wifi.disconnectFromWiFi}
            appTheme={appTheme}
          />
        )}
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => navigation.navigate('ScreenThree')}
          activeOpacity={0.8}
        >
          <Text style={styles.navigateButtonText}>{Translate('Navigate')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <WiFiPasswordModal
        visible={wifi.showPasswordModal}
        networkToConnect={wifi.networkToConnect}
        wifiPassword={wifi.wifiPassword}
        onPasswordChange={wifi.setWifiPassword}
        onConnect={wifi.handleConnectWithPassword}
        onClose={wifi.closePasswordModal}
      />
    </SafeAreaView>
  );
};

export default ScreenTwo;
