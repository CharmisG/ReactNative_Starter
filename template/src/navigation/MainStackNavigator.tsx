import 'react-native-gesture-handler';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenTwo from '../screens/ScreenTwo';
import ScreenThree from '../screens/ScreenThree';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import React, { useEffect, useState } from 'react';
import { AppConstants } from '../constants/AppConstants';
import TextEditorScreen from '../screens/TextEditorScreen';
import LoginScreen from '../components/socialLogin';
import { AuthProvider, AuthContext } from '../hooks/AuthContext';

const Stack = createNativeStackNavigator();

/**
 * Main navigator
 *
 * Contains screens included in the drawer menu,
 */
export default function MainStackNavigator(): React.JSX.Element {
  const { appTheme } = useSelector((state: RootState) => state.Settings);
  const [applicationTheme, setApplicationTheme] = useState(DefaultTheme);

  const { loginType } = React.useContext(AuthContext);


  useEffect(() => {
    console.log('loginType:', loginType);
    setApplicationTheme(
      appTheme === AppConstants.dark ? DarkTheme : DefaultTheme,
    );
  }, [appTheme]);

  return (
    <NavigationContainer theme={applicationTheme}>
      <Stack.Navigator
        // initialRouteName={loginType == null ? "Login" : "Tabs"}
        initialRouteName={"Tabs"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="Tabs" component={MainTabNavigator} />
        < Stack.Screen name="ScreenTwo" component={ScreenTwo} />
        <Stack.Screen name="ScreenThree" component={ScreenThree} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="TextEditor" component={TextEditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
