import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeNavigatorStackParamList} from 'src/@types/navigation';

import Home from '@views/Home';
import PublicProfile from '@views/PublicProfile';

interface Props {}

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>();

const HomeNavigator: FC<Props> = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
