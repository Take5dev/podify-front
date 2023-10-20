import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '@utils/colors';

import {getAuthState} from 'src/store/auth';

import ProfileContainer from '@components/ProfileContainer';
import UploadsTab from '@components/profile/UploadsTab';
import PlaylistsTab from '@components/profile/PlaylistsTab';
import FavoritesTab from '@components/profile/FavoritesTab';
import HistoryTab from '@components/profile/HistoryTab';
import AppView from '@components/AppView';

const Tab = createMaterialTopTabNavigator();

interface Props {}

const Profile: FC<Props> = props => {
  const {profile} = useSelector(getAuthState);
  return (
    <AppView>
      <View style={styles.container}>
        <ProfileContainer profile={profile} />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}>
          <Tab.Screen name="Uploads" component={UploadsTab} />
          <Tab.Screen name="Playlists" component={PlaylistsTab} />
          <Tab.Screen name="Favorites" component={FavoritesTab} />
          <Tab.Screen name="History" component={HistoryTab} />
        </Tab.Navigator>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
    marginBottom: 10,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowColor: 'transparent',
  },
  tabBarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
  },
});

export default Profile;
