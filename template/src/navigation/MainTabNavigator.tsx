import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Image, Platform } from 'react-native';
import Images from '../utils/Images';
import Colors from '../styles/Colors';
import GraphCallTestScreen from '../screens/GraphCallTestScreen';

const Tab = createBottomTabNavigator();

/**
 * Home Tab navigator
 * 
 * Contains screens included in the bottom tabs,
 */
export default function MainTabNavigator() {
  return (
    <Tab.Navigator initialRouteName='Dashboard' screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.charcoal,
        tabBarStyle: {
            paddingTop: Platform.OS === 'android' ? 10 : 16,
            paddingBottom: Platform.OS === 'android' ? 10 : 24,
            height: Platform.OS === 'android' ? 70 : 80,
          },
    }}>
      <Tab.Screen name="Home" component={DashboardScreen} options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={Images.home}
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? Colors.primary : Colors.charcoal,
              }}
            />
          ),
        }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={Images.profile}
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? Colors.primary : Colors.charcoal,
              }}
            />
          ),
        }}/>
        <Tab.Screen name="Graph Test" component={GraphCallTestScreen} options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={Images.profile}
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? Colors.primary : Colors.charcoal,
              }}
            />
          ),
        }}/>
    </Tab.Navigator>
  );
}
