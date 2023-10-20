import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
  HomeNavigatorStackParamList,
  PublicProfileTabsParamList,
} from 'src/@types/navigation';

import {useFetchPublicProfile} from 'src/hooks/query';

import colors from '@utils/colors';

import AppView from '@components/AppView';
import PublicProfileContainer from '@components/profile/PublicProfileContainer';
import PublicUploadsTab from '@components/profile/PublicUploadsTab';
import PublicPlaylistsTab from '@components/profile/PublicPlaylistsTab';

const Tab = createMaterialTopTabNavigator<PublicProfileTabsParamList>();

type Props = NativeStackScreenProps<
  HomeNavigatorStackParamList,
  'PublicProfile'
>;

const PublicProfile: FC<Props> = ({route}) => {
  const {userId} = route.params;
  const {data: user} = useFetchPublicProfile(userId || '');
  return (
    <AppView>
      <View style={styles.container}>
        <PublicProfileContainer profile={user} />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}>
          <Tab.Screen
            name="PublicUploads"
            component={PublicUploadsTab}
            options={{tabBarLabel: 'Uploads'}}
            initialParams={{
              userId,
            }}
          />
          <Tab.Screen
            name="PublicPlaylists"
            component={PublicPlaylistsTab}
            options={{tabBarLabel: 'Playlists'}}
            initialParams={{
              userId,
            }}
          />
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

export default PublicProfile;
