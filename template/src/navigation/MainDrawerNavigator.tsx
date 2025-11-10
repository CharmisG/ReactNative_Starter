import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import MainTabNavigator from './MainTabNavigator';

const Drawer = createDrawerNavigator();

/**
 * UNUSED
 * @returns Screens part of side drawer menu
 */
export default function MainDrawerNavigator() {
  return (
      <Drawer.Navigator
        initialRouteName="HomeStack"
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
        }}>
        <Drawer.Screen  name="HomeTab" component={MainTabNavigator} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
  );
}
