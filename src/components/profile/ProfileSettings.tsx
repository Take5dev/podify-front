import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import deepEqual from 'deep-equal';
import ImagePicker from 'react-native-image-crop-picker';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import {useQueryClient} from 'react-query';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {updateNotification} from 'src/store/notification';
import {
  getAuthState,
  updateBusyState,
  updateIsLoggedIn,
  updateProfile,
} from 'src/store/auth';

import {Keys, removeFromAsyncStorage} from '@utils/asyncStorage';

import {getPermissionToReadImages} from '@utils/helper';
import colors from '@utils/colors';

import AppHeader from '@components/AppHeader';
import ReverificationLink from '@components/ReverificationLink';

import AvatarField from '@ui/AvatarField';
import AppButton from '@ui/AppButton';

interface Props {}

interface ProfileUpdateInfo {
  name: string;
  avatar?: string;
}

const ProfileSettings: FC<Props> = () => {
  const [userInfo, setUserInfo] = useState<ProfileUpdateInfo>({
    name: '',
  });
  const [busy, setBusy] = useState(false);
  const {profile} = useSelector(getAuthState);
  const isSame = deepEqual(userInfo, {
    name: profile?.name,
    avatar: profile?.avatar,
  });
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const logoutHandler = async (fromAll?: boolean) => {
    const endpoint = `/auth/logout?fromAll=${fromAll ? 'yes' : ''}`;
    dispatch(updateBusyState(true));
    try {
      const client = await getClient();
      await client.post(endpoint);
      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateIsLoggedIn(false));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
    dispatch(updateBusyState(false));
  };

  const changeNameHandler = (text: string) => {
    setUserInfo(prevState => {
      const newState = {...prevState};
      newState.name = text;
      return newState;
    });
  };

  const avatarSelectHandler = async () => {
    try {
      await getPermissionToReadImages();
      const {path} = await ImagePicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
      });

      setUserInfo(prevState => {
        const newState = {...prevState};
        newState.avatar = path;
        return newState;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (userInfo.name.trim().length < 3) {
      dispatch(
        updateNotification({
          message: 'Name must be at least 3 characters',
          type: 'error',
        }),
      );
      return;
    }

    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('name', userInfo.name);

      if (userInfo.avatar) {
        formData.append('avatar', {
          name: 'avatar',
          type: 'image/jpeg',
          uri: userInfo.avatar,
        });
      }

      const client = await getClient({
        'Content-Type': 'multipart/form-data;',
      });
      const {data} = await client.post('/auth/profile', formData);

      dispatch(updateProfile(data.profile));

      dispatch(
        updateNotification({
          message: 'Changes are saved',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
    setBusy(false);
  };

  const clearUserHistory = async () => {
    try {
      const client = await getClient();
      await client.delete('/history?all=yes');
      queryClient.invalidateQueries({
        queryKey: 'user-history',
      });
      dispatch(
        updateNotification({
          message: 'History is cleared',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
  };

  const clearHistoryPressHandler = () => {
    Alert.alert(
      'Are you sure?',
      "You're going to clear your entire history",
      [
        {
          text: 'Clear',
          style: 'destructive',
          onPress() {
            clearUserHistory();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  useEffect(() => {
    if (profile) {
      const {name, avatar} = profile;
      setUserInfo({
        name,
        avatar,
      });
    }
  }, [profile]);

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Settings</Text>
      </View>
      <View style={styles.settingsOptionsContainer}>
        <View style={styles.avatarContainer}>
          <AvatarField source={userInfo.avatar} />
          <Pressable style={styles.avatarLink} onPress={avatarSelectHandler}>
            <Text style={styles.linkText}>Update Avatar</Text>
          </Pressable>
        </View>
        <TextInput
          onChangeText={text => changeNameHandler(text)}
          style={styles.nameInput}
          value={userInfo.name}
        />
        <View style={styles.emailContainer}>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.verified && (
            <MIcon name="verified" size={15} color={colors.SECONDARY} />
          )}
          {!profile?.verified && (
            <ReverificationLink activeAtFirst={true} linkTitle="Verify email" />
          )}
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>History</Text>
      </View>
      <View style={styles.settingsOptionsContainer}>
        <Pressable
          style={styles.logoutBtn}
          onPress={() => {
            clearHistoryPressHandler();
          }}>
          <MCIcon name="broom" size={20} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnLabel}>Clear all history</Text>
        </Pressable>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Log Out</Text>
      </View>
      <View style={styles.settingsOptionsContainer}>
        <Pressable
          style={styles.logoutBtn}
          onPress={() => {
            logoutHandler(true);
          }}>
          <ADIcon name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnLabel}>Log Out from all devices</Text>
        </Pressable>
        <Pressable
          style={styles.logoutBtn}
          onPress={() => {
            logoutHandler();
          }}>
          <ADIcon name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnLabel}>Log Out from this device</Text>
        </Pressable>
      </View>
      {!isSame && (
        <View style={styles.submitContainer}>
          <AppButton
            busy={busy}
            onPress={handleSubmit}
            title="Apply changes"
            style={{borderRadius: 7}}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    color: colors.SECONDARY,
    fontWeight: 'bold',
    fontSize: 18,
  },
  settingsOptionsContainer: {
    marginTop: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLink: {
    paddingLeft: 15,
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
  },
  nameInput: {
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    color: colors.CONTRAST,
    fontWeight: 'bold',
    marginTop: 15,
    padding: 10,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  logoutBtnLabel: {
    color: colors.CONTRAST,
    marginLeft: 10,
  },
  submitContainer: {
    marginTop: 15,
  },
});

export default ProfileSettings;
