import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setAppTheme } from '../redux/slices/SettingsSlice';
import { AppConstants } from '../constants/AppConstants';
import { FeatureFlags } from '../config/AppConfig';
import { getItem, setItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';
import { showToast } from '../components/ToastContext';
import { FileLogger, LogLevel } from 'react-native-file-logger';
import { getCrashlytics, setUserId as setCrashlyticsUserId, crash } from '@react-native-firebase/crashlytics';
import { getAnalytics, logEvent, setUserId as setAnalyticsUserId } from '@react-native-firebase/analytics';
import { VersionSliceActions } from '../redux/slices/VersionSlice';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert } from 'react-native';
import i18n from '../Localization/Localize';
import Translate from './Translate';
import Colors from '../styles/Colors';

declare global {
  var appLanguage: string | undefined;
}

export const useSettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appTheme } = useSelector((state: RootState) => state.Settings);
  const [enabled, setEnabled] = useState(true);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    global.appLanguage ?? FeatureFlags.localization?.defaultLanguage ?? 'en',
  );
  const [darkTheme, setDarkTheme] = useState(appTheme === AppConstants.dark);
  const [lastVersionCheck, setLastVersionCheck] = useState<Date | null>(null);
  const [appInstalledDate, setAppInstalledDate] = useState<Date | null>(null);

  const { share, showShareOptions, isSharing } = useSocialShare();

  const localizationConfig = FeatureFlags.localization;
  const supportedLanguages = (localizationConfig?.supportedLanguages ?? []) as string[];
  const localizationEnabled = localizationConfig?.enabled ?? false;

  const themeColors = useMemo(() => ({
    cardBg: appTheme === AppConstants.dark ? Colors.grey : Colors.white,
    textColor: appTheme === AppConstants.dark ? Colors.white : Colors.charcoal,
    accentColor: appTheme === AppConstants.dark ? Colors.white : Colors.accent,
    containerBg: appTheme === AppConstants.dark ? Colors.black : Colors.white,
    infoContainerBg: appTheme === AppConstants.dark ? Colors.grey : Colors.lightGrey,
  }), [appTheme]);

  const settingsList = useMemo(() =>
    supportedLanguages.map(lang => {
      switch (lang) {
        case 'es':
          return { name: Translate('Spanish'), value: 'es' };
        case 'en':
        default:
          return { name: Translate('English'), value: 'en' };
      }
    }), [supportedLanguages]
  );

  const onLanguageChanged = useCallback(async (val: string) => {
    if (!localizationEnabled || !supportedLanguages.includes(val)) {
      if (!supportedLanguages.includes(val)) {
        showToast({ text: 'Language not supported', type: 'error' });
      }
      return;
    }
    i18n.changeLanguage(val);
    global.appLanguage = val;
    setSelectedLanguage(val);
    try {
      await setItem(StorageKeys.SELECTED_LANGUAGE, val);
    } catch (error) {
      if (__DEV__) console.warn('Failed to save language preference:', error);
    }
  }, [localizationEnabled, supportedLanguages]);

  const toggleSwitch = useCallback(() => setDarkTheme(prev => !prev), []);

  const onCrashlyticsTest = useCallback(async () => {
    try {
      await setCrashlyticsUserId(getCrashlytics(), 'user-123');
    } catch (e) {
      console.warn('Crashlytics record failed', e);
    }
    if (__DEV__) {
      showToast({ text: 'Crash is disabled in debug run a release build to test.' });
      return;
    }
    await crash(getCrashlytics());
  }, []);

  const onAnalyticsTest = useCallback(async () => {
    const analytics = getAnalytics();
    await setAnalyticsUserId(analytics, 'user123');
    await logEvent(analytics, 'test_event', { id: 123456, item: 'Test Item', description: ['This is a test event'], size: 'M' });
    showToast({ text: 'A test analytics event has been logged.' });
  }, []);

  const onShowToast = useCallback(() => showToast({ text: 'This is a test toast', type: 'success' }), []);

  const onCheckAppVersion = useCallback(async () => {
    try {
      showToast({ text: 'Checking for app updates...', type: 'info' });
      await dispatch(VersionSliceActions.checkVersionUpdate());
      const now = new Date();
      setLastVersionCheck(now);
      await setItem(StorageKeys.LAST_VERSION_CHECK, now.toISOString());
    } catch (error) {
      console.error('Version check failed', error);
      showToast({ text: 'Failed to check for updates', type: 'error' });
    }
  }, [dispatch]);

  const changeEnabled = useCallback((value: boolean) => {
    value ? FileLogger.enableConsoleCapture() : FileLogger.disableConsoleCapture();
    setEnabled(value);
  }, []);

  const showLogFilePaths = useCallback(async () => {
    Alert.alert(Translate('Show file paths'), (await FileLogger.getLogFilePaths()).join("\n"));
  }, []);

  const handleImagePickerResult = useCallback((assets?: Asset[] | null, errorMessage?: string) => {
    if (errorMessage) {
      showToast({ text: errorMessage, type: 'error' });
      return;
    }
    if (assets?.[0]?.uri) setSelectedImageUri(assets[0].uri);
  }, []);

  const onPickImageFromLibrary = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7, selectionLimit: 1 });
    if (!result.didCancel) handleImagePickerResult(result.assets, result.errorMessage);
  }, [handleImagePickerResult]);

  const onCaptureImageWithCamera = useCallback(async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.7, saveToPhotos: true, cameraType: 'back' });
    if (!result.didCancel) handleImagePickerResult(result.assets, result.errorMessage);
  }, [handleImagePickerResult]);

  useEffect(() => {
    dispatch(setAppTheme(darkTheme ? AppConstants.dark : AppConstants.light));
    FileLogger.configure({ logLevel: LogLevel.Debug, maximumFileSize: 1024 });
  }, [darkTheme, dispatch]);

  useEffect(() => {
    const loadDateInfo = async () => {
      try {
        const lastCheck = await getItem(StorageKeys.LAST_VERSION_CHECK);
        if (lastCheck) setLastVersionCheck(new Date(lastCheck));
        let installDate = await getItem(StorageKeys.APP_INSTALLED_DATE);
        if (!installDate) {
          installDate = new Date().toISOString();
          await setItem(StorageKeys.APP_INSTALLED_DATE, installDate);
        }
        setAppInstalledDate(new Date(installDate));
      } catch (error) {
        if (__DEV__) console.warn('Failed to load date information', error);
      }
    };
    loadDateInfo();
  }, []);

  const onShareApp = useCallback(async () => {
    try {
      await showShareOptions();
    } catch (error) {
      if (__DEV__) {
        console.warn('Share failed:', error);
      }
    }
  }, [showShareOptions]);

  return {
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
  };
};

