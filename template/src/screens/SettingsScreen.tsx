import {
  Text,
  View,
  Switch,
  StyleSheet,
  Alert,
  Button,
  Pressable,
} from 'react-native';
import MainView from '../components/MainView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../styles/Colors';
import { useEffect, useState } from 'react';
import DropdownModel from '../models/DropdownModel';
import i18n from '../Localization/Localize';
import Translate from '../hooks/Translate';
import { fontHeight, fontWidth } from '../styles/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setAppTheme } from '../redux/slices/SettingsSlice';
import { AppConstants } from '../constants/AppConstants';
import { LogEvent } from '../utils/EventLogger';
import { Events } from '../constants/EventConstants';
import { FileLogger, LogLevel } from "react-native-file-logger";
import { windowHeight, windowWidth } from '../styles/Dimens';
import { getCrashlytics, setUserId as setCrashlyticsUserId, crash, recordError, log as crashlyticsLog } from '@react-native-firebase/crashlytics';
import { showToast } from '../contexts/ToastContext';
import { getAnalytics, logEvent, setUserId as setAnalyticsUserId } from '@react-native-firebase/analytics';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { appTheme } = useSelector((state: RootState) => state.Settings);
  const [enabled, setEnabled] = useState(true);
  const crashlyticsInstance = getCrashlytics();
  const analyticsInstance = getAnalytics();

  const [selectedLanguage, setSelectedLanguage] = useState(
    global.appLanguage ?? 'en',
  );
  const [darkTheme, setDarkTheme] = useState(
    appTheme === AppConstants.dark ? true : false,
  );

  const settingsList: any = [
    new DropdownModel(Translate('English'), 'en'),
    new DropdownModel(Translate('Spanish'), 'es'),
  ];

  function onLanguageChanged(val: string) {
    i18n.changeLanguage(val);
    global.appLanguage = val;
    setSelectedLanguage(val);
  }

  function toggleSwitch() {
    setDarkTheme(!darkTheme);
  }

  useEffect(() => {
    dispatch(setAppTheme(darkTheme ? AppConstants.dark : AppConstants.light));
    FileLogger.configure({ logLevel: LogLevel.Debug, maximumFileSize: 1024 }).then(() =>
      console.log("File-logger configured")
    );
  }, [darkTheme]);

  useEffect(() => {
    LogEvent({
      screenName: 'Settings',
      eventName: Events.ScreenStarting,
      printToConsole: true,
    });
  }, []);


  const onCrashlyticsTest = async () => {
    try {
      await setCrashlyticsUserId(crashlyticsInstance, 'user-123');
    } catch (e) {
      console.warn('Crashlytics record failed', e);
    }
    if (__DEV__) {
      showToast({ text: 'Crash is disabled in debug run a release build to test.' });
      return;
    }
    await crash(crashlyticsInstance);
  };

  const onAnalyticsTest = async () => {
    await setAnalyticsUserId(analyticsInstance, 'user123');
    await logEvent(analyticsInstance, 'test_event', {
      id: 123456,
      item: 'Test Item',
      description: ['This is a test event'],
      size: 'M',
    });
    showToast({ text: 'A test analytics event has been logged.' });
  }

  const onShowToast = () => {
    showToast({ text: 'This is a test toast', type: 'success' });
  };

  const changeEnabled = (value: boolean) => {
    if (value) {
      FileLogger.enableConsoleCapture();
    } else {
      FileLogger.disableConsoleCapture();
    }
    setEnabled(value);
  };

  const showLogFilePaths = async () => {
    Alert.alert(Translate('Show file paths'), (await FileLogger.getLogFilePaths()).join("\n"));
  };

  return (
    <MainView
      screenTitle={Translate('Settings')}
      leftIconPressed={() => navigation.goBack()}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: appTheme === AppConstants.dark ? Colors.black : Colors.white }
        ]}
      >

        {/* 🌐 Language */}
        <View style={[styles.card, { backgroundColor: appTheme === AppConstants.dark ? Colors.grey : Colors.white }]}>
          <Text style={styles.cardTitle}>{Translate('Change Language')}</Text>

          <Dropdown
            data={settingsList}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            labelField="name"
            valueField="value"
            placeholder={Translate('Select Language')}
            value={selectedLanguage}
            onChange={item => onLanguageChanged(item.value)}
          />
        </View>

        {/* 🎨 Appearance */}
        <View style={[styles.card, { backgroundColor: appTheme === AppConstants.dark ? Colors.grey : Colors.white }]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>{Translate('Change Appearance')}</Text>
              <Text style={styles.cardSubtitle}>
                {darkTheme ? Translate('Dark') : Translate('Light')}
              </Text>
            </View>

            <Switch value={darkTheme} onValueChange={toggleSwitch} />
          </View>
        </View>

        {/* 📁 File Logging */}
        <View style={[styles.card, { backgroundColor: appTheme === AppConstants.dark ? Colors.grey : Colors.white }]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>{Translate('Filebase Logging')}</Text>

              <Text
                onPress={showLogFilePaths}
                style={[styles.cardSubtitle, styles.textLink]}
              >
                {Translate('Show file paths')}
              </Text>
            </View>

            <Switch value={enabled} onValueChange={changeEnabled} />
          </View>
        </View>

        {/* 🧪 Crashlytics & Toast Test */}
        <Pressable
          style={({ pressed }) => [styles.commonStyles, styles.crashButton, pressed && styles.buttonPressedEffect]}
          onPress={onCrashlyticsTest}
        >
          <Text style={styles.buttonText}>{Translate('Test Crashlytics')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.commonStyles, styles.crashButton, pressed && styles.buttonPressedEffect]}
          onPress={onAnalyticsTest}
        >
          <Text style={styles.buttonText}>{Translate('Test Analytics')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.commonStyles, styles.toastButton, pressed && styles.buttonPressedEffect]}
          onPress={onShowToast}
        >
          <Text style={styles.buttonText}>{Translate('Show Toast')}</Text>
        </Pressable>


      </View>
    </MainView>

  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  /* ✨ Card Wrapper */
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: 18,
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  /* 📝 Titles */
  cardTitle: {
    color: Colors.charcoal,
    fontSize: fontWidth.FONT22,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 10,
  },

  cardSubtitle: {
    color: Colors.accent,
    fontSize: fontHeight.FONT13,
    fontWeight: '500',
    marginTop: 4,
  },

  textLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginTop: 6,
  },

  /* 🔽 Dropdown modernized */
  dropdown: {
    height: windowHeight(40),
    borderRadius: 12,
    paddingHorizontal: windowWidth(15),
    backgroundColor: Colors.lightGrey,
    borderWidth: 0,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  placeholderStyle: {
    fontSize: 16,
    color: Colors.grey,
  },

  selectedTextStyle: {
    fontSize: fontHeight.FONT16,
    fontWeight: '600',
    color: Colors.charcoal,
  },

  iconStyle: {
    width: windowWidth(26),
    height: windowHeight(26),
    tintColor: Colors.accent,
  },

  /* Layout helpers */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* 🧪 Diagnostics Buttons */
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 14,
  },
  diagButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  commonStyles: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginTop: windowHeight(10)
  },
  crashButton: {
    backgroundColor: Colors.accent,
  },
  toastButton: {
    backgroundColor: Colors.accent,

  },
  buttonPressedEffect: {
    opacity: 0.85,
    elevation: 2,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: fontHeight.FONT16,
    fontWeight: '700',
    textAlign: 'center',
  },
});