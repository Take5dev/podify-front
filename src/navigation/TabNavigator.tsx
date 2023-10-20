import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '@utils/colors';

import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';

import Upload from '@views/Upload';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: colors.PRIMARY},
      }}>
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarIcon: props => (
            <Icon name="home" size={props.size} color={props.color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarIcon: props => (
            <Icon name="user" size={props.size} color={props.color} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={Upload}
        options={{
          tabBarIcon: props => (
            <MCIcon
              name="account-music-outline"
              size={props.size}
              color={props.color}
            />
          ),
          tabBarLabel: 'Upload',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
