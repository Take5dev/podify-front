import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

import ProfileSettings from '@components/profile/ProfileSettings';
import UpdateAudio from '@components/profile/UpdateAudio';

import Profile from '@views/Profile';
import VerifyEmail from '@views/auth/VerifyEmail';

interface Props {}

const Stack = createNativeStackNavigator<ProfileNavigatorStackParamList>();

const ProfileNavigator: FC<Props> = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      <Stack.Screen name="UpdateAudio" component={UpdateAudio} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
