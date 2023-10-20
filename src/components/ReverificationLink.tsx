import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import colors from '@utils/colors';

import {NewUser} from 'src/@types/navigation';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {getAuthState} from 'src/store/auth';
import {updateNotification} from 'src/store/notification';

import AppLink from '@ui/AppLink';

interface Props {
  time?: number;
  activeAtFirst?: boolean;
  linkTitle: string;
  userId?: string;
  setOtp?: Dispatch<SetStateAction<string[]>>;
  setOtpIndex?: Dispatch<SetStateAction<number>>;
  setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
}

type PossibleStackParamList = {
  ProfileSettings: undefined;
  VerifyEmail: {user?: NewUser};
};

const defaultResendTimeout = 60;
const otpFields: string[] = new Array(6).fill('');

const ReverificationLink: FC<Props> = ({
  time = defaultResendTimeout,
  activeAtFirst = false,
  linkTitle,
  userId,
  setOtp,
  setOtpIndex,
  setIsSubmitting,
}) => {
  const [countDown, setCountDown] = useState(time);
  const [isNewOTPRequestEnabled, setIsNewOTPRequestEnabled] =
    useState(activeAtFirst);
  const dispatch = useDispatch();
  const {profile} = useSelector(getAuthState);
  const navigation = useNavigation<NavigationProp<PossibleStackParamList>>();
  const resendOTPHandler = async () => {
    const {routeNames} = navigation.getState();
    if (routeNames.includes('VerifyEmail') && setIsSubmitting) {
      setIsSubmitting(true);
    }
    setCountDown(defaultResendTimeout);
    setIsNewOTPRequestEnabled(false);
    try {
      const client = await getClient();
      const {data} = await client.post('/auth/reverify', {
        _id: userId || profile?._id,
      });
      dispatch(
        updateNotification({
          message: data.message,
          type: 'success',
        }),
      );

      if (routeNames.includes('VerifyEmail') && setOtp && setOtpIndex) {
        setOtp([...otpFields]);
        setOtpIndex(0);
      }
      navigation.navigate('VerifyEmail', {
        user: {
          _id: userId || profile?._id || '',
          email: profile?.email || '',
          name: profile?.name || '',
        },
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
    if (routeNames.includes('VerifyEmail') && setIsSubmitting) {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isNewOTPRequestEnabled) {
      const interval = setInterval(() => {
        setCountDown(prevState => {
          if (prevState <= 0) {
            clearInterval(interval);
            setIsNewOTPRequestEnabled(true);
            return 0;
          }
          return prevState - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isNewOTPRequestEnabled]);
  return (
    <View style={styles.container}>
      {!isNewOTPRequestEnabled && (
        <Text style={styles.countdown}>{countDown} seconds</Text>
      )}
      <AppLink
        active={isNewOTPRequestEnabled}
        title={linkTitle}
        onPress={resendOTPHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdown: {
    color: colors.INACTIVE_CONTRAST,
    marginRight: 12,
  },
});

export default ReverificationLink;
