import {
  Text,
  View,
  Switch,
  StyleSheet,
  Alert,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { appTheme } = useSelector((state: RootState) => state.Settings);
  const [enabled, setEnabled] = useState(true);

  const [selectedLanguage, setSelectedLanguage] = useState(
    global.appLanguage ?? 'en',
  );
  const [darkTheme, setDarkTheme] = useState(
    appTheme === AppConstants.dark ? true : false,
  );

  const settingsList: any = [
    new DropdownModel('English', 'en'),
    new DropdownModel('Espanol', 'es'),
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

  const changeEnabled = (value: boolean) => {
    if (value) {
      FileLogger.enableConsoleCapture();
    } else {
      FileLogger.disableConsoleCapture();
    }
    setEnabled(value);
  };

  const showLogFilePaths = async () => {
    Alert.alert("File paths", (await FileLogger.getLogFilePaths()).join("\n"));
  };

  return (
    <MainView
      screenTitle={Translate('Settings')}
      leftIconPressed={() => navigation.goBack()}>
      <View style={{ flex: 1, padding: 20, backgroundColor: appTheme === AppConstants.dark ? Colors.black : Colors.white }}>
        <Text style={styles.titleStyle}>{Translate('Change Language')}</Text>
        <Dropdown
          data={settingsList}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{ color: Colors.black }}
          maxHeight={300}
          labelField="name"
          valueField="value"
          placeholder={'Select Language'}
          value={selectedLanguage}
          onChange={item => {
            onLanguageChanged(item.value);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View>
            <Text style={styles.titleStyle}>
              {Translate('Change Appearance')}
            </Text>
            <View style={{ marginTop: 4 }}>
              {darkTheme && (
                <Text style={styles.subTitleStyle}>{Translate('Dark')}</Text>
              )}
              {!darkTheme && (
                <Text style={styles.subTitleStyle}>{Translate('Light')}</Text>
              )}
            </View>
          </View>
          <Switch
            value={darkTheme}
            onChange={() => {
              toggleSwitch();
            }}
          />
        </View>
        <View style={styles.settingsRow}>
          <View>
            <Text style={styles.titleStyle}>{Translate('Filebase Logging')}</Text>
            <View>
              <Text
                onPress={showLogFilePaths}
                style={[styles.subTitleStyle, styles.button]}>{Translate('Show file paths')}</Text>
            </View>
          </View>
          <Switch value={enabled} onValueChange={changeEnabled} />
        </View>
      </View>
    </MainView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  dropdown: {
    marginVertical: 10,
    height: 50,
    borderColor: Colors.white,
    backgroundColor: Colors.lightGrey,
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  titleStyle: {
    color: Colors.charcoal,
    fontSize: fontWidth.FONT20,
    fontWeight: '600',
  },
  subTitleStyle: {
    color: Colors.accent,
    fontSize: fontHeight.FONT11,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    textDecorationLine: 'underline'
  },
});
