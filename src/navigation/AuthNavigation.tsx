import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthStackParamList} from 'src/@types/navigation';

import SignUp from '@views/auth/SignUp';
import LogIn from '@views/auth/LogIn';
import ForgotPassword from '@views/auth/ForgotPassword';
import VerifyEmail from '@views/auth/VerifyEmail';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
