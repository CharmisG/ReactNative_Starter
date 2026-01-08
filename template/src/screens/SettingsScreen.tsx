import { ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import MainView from '../components/MainView';
import Translate from '../hooks/Translate';
import { useSettingsScreen } from '../hooks/useSettingsScreen';
import { SettingsCards } from '../components/settings/SettingsCards';
import { styles } from '../components/settings/SettingsCardStyles';
import { LogEvent } from '../utils/EventLogger';
import { Events } from '../constants/EventConstants';
import { useEffect } from 'react';
import { windowHeight } from '../styles/Dimens';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const {
    themeColors,
    settingsList,
    enabled,
    selectedImageUri,
    selectedLanguage,
    darkTheme,
    lastVersionCheck,
    appInstalledDate,
    localizationEnabled,
    onLanguageChanged,
    toggleSwitch,
    onCrashlyticsTest,
    onAnalyticsTest,
    onShowToast,
    onCheckAppVersion,
    changeEnabled,
    showLogFilePaths,
    onPickImageFromLibrary,
    onCaptureImageWithCamera,
    onShareApp,
    isSharing,
    onSendNotification,
    isNotificationLoading,
  } = useSettingsScreen();

  useEffect(() => {
    LogEvent({ screenName: 'Settings', eventName: Events.ScreenStarting, printToConsole: true });
  }, []);

  return (
    <MainView screenTitle={Translate('Settings')} leftIconPressed={() => navigation.goBack()}>
      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.containerBg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsCards
          themeColors={themeColors}
          enabled={enabled}
          darkTheme={darkTheme}
          selectedLanguage={selectedLanguage}
          settingsList={settingsList}
          localizationEnabled={localizationEnabled}
          lastVersionCheck={lastVersionCheck}
          appInstalledDate={appInstalledDate}
          selectedImageUri={selectedImageUri}
          onLanguageChanged={onLanguageChanged}
          toggleSwitch={toggleSwitch}
          changeEnabled={changeEnabled}
          showLogFilePaths={showLogFilePaths}
          onCrashlyticsTest={onCrashlyticsTest}
          onAnalyticsTest={onAnalyticsTest}
          onShowToast={onShowToast}
          onCheckAppVersion={onCheckAppVersion}
          onPickImageFromLibrary={onPickImageFromLibrary}
          onCaptureImageWithCamera={onCaptureImageWithCamera}
          onShareApp={onShareApp}
          isSharing={isSharing}
          onSendNotification={onSendNotification}
          isNotificationLoading={isNotificationLoading}
        />
      </ScrollView>
    </MainView>
  );
};

export default SettingsScreen;