import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateBusyState,
  updateIsLoggedIn,
  updateProfile,
} from 'src/store/auth';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';

import AuthNavigation from './AuthNavigation';
import TabNavigation from './TabNavigator';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {updateNotification} from 'src/store/notification';

import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import colors from '@utils/colors';

import Loader from '@ui/Loader';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const RootNavigation: FC<Props> = () => {
  const {isLoggedIn, isBusy} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthData = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          dispatch(updateBusyState(false));
          return;
        }

        const client = await getClient();
        const {data} = await client.get('/auth/is-auth');

        dispatch(updateProfile(data.user));
        dispatch(updateIsLoggedIn(true));
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
    fetchAuthData();
  }, [dispatch]);
  return (
    <NavigationContainer onReady={() => BootSplash.hide()} theme={AppTheme}>
      {isBusy ? (
        <View style={styles.overlay}>
          <Loader />
        </View>
      ) : isLoggedIn ? (
        <TabNavigation />
      ) : (
        <AuthNavigation />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default RootNavigation;
