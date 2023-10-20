import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import OctiIcon from 'react-native-vector-icons/Octicons';

import {UserProfile} from 'src/store/auth';

import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

import colors from '@utils/colors';

import AvatarField from '@ui/AvatarField';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer: FC<Props> = ({profile}) => {
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();
  if (!profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.profileBottom}>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          {profile.verified && (
            <MIcon name="verified" size={15} color={colors.SECONDARY} />
          )}
          {!profile.verified && (
            <OctiIcon name="unverified" size={15} color={colors.SECONDARY} />
          )}
        </View>
        <View style={styles.profileBottom}>
          <Text style={styles.profileCount}>{profile.followers} followers</Text>
          <Text style={styles.profileCount}>
            {profile.followings} followings
          </Text>
        </View>
      </View>
      <Pressable
        style={styles.settings}
        onPress={() => navigate('ProfileSettings')}>
        <ADIcon name="setting" size={22} color={colors.CONTRAST} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileEmail: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  profileCount: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 5,
    color: colors.PRIMARY,
    marginRight: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  settings: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileContainer;
