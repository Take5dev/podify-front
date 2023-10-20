import React, {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';

import {
  AuthStackParamList,
  LogginInUser,
  ProfileNavigatorStackParamList,
} from 'src/@types/navigation';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {updateNotification} from 'src/store/notification';

import colors from '@utils/colors';

import AuthFormContainer from '@components/form/AuthFormContainer';

import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import ReverificationLink from '@components/ReverificationLink';

type Props = NativeStackScreenProps<
  AuthStackParamList | ProfileNavigatorStackParamList,
  'VerifyEmail'
>;

type PossibleStackParamList = {
  ProfileSettings: undefined;
  LogIn: {user?: LogginInUser};
};

const otpFields: string[] = new Array(6).fill('');
const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const VerifyEmail: FC<Props> = ({route}) => {
  const [otp, setOtp] = useState([...otpFields]);
  const [otpIndex, setOtpIndex] = useState(0);
  const [wrongKey, setWrongKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const {user} = route.params;

  const navigation = useNavigation<NavigationProp<PossibleStackParamList>>();

  const inputRef = useRef<TextInput>(null);

  const inputTransformValue = useSharedValue(0);
  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: inputTransformValue.value}],
    };
  });

  const keyPressHandler = (key: string, index: number) => {
    if (key === 'Backspace') {
      setWrongKey(false);
      setOtp((prevState: string[]): string[] => {
        const newOtp = [...prevState];
        if (!newOtp[index]) {
          setOtpIndex(index - 1);
          return prevState;
        } else {
          newOtp[index] = '';
          return newOtp;
        }
      });
    } else {
      if (numberKeys.includes(key)) {
        setWrongKey(false);
        setOtp((prevState: string[]): string[] => {
          const newOtp = [...prevState];
          newOtp[index] = key;
          return newOtp;
        });
        setOtpIndex(index + 1);
      } else {
        setWrongKey(true);
      }
    }
  };
  const pasteHandler = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const pastedOtp = value.split('');
      setOtp([...pastedOtp]);
    }
  };
  const isValidOtp = otp.every(
    value => value.trim() && numberKeys.includes(value),
  );
  const submitHandler = async () => {
    if (!isValidOtp) {
      setWrongKey(true);
      dispatch(
        updateNotification({
          message: 'Invalid OTP',
          type: 'error',
        }),
      );
    }
    setIsSubmitting(true);
    try {
      const client = await getClient();
      const {data} = await client.post('/auth/verify', {
        _id: user?._id,
        token: otp.join(''),
      });
      dispatch(
        updateNotification({
          message: data.message,
          type: 'success',
        }),
      );
      const {routeNames} = navigation.getState();
      if (routeNames.includes('LogIn')) {
        navigation.navigate('LogIn', {
          user: {
            email: user?.email,
          },
        });
      }
      if (routeNames.includes('ProfileSettings')) {
        navigation.navigate('ProfileSettings');
      }
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [otpIndex]);

  useEffect(() => {
    const shakeUI = () => {
      inputTransformValue.value = withSequence(
        withTiming(-10, {duration: 50}),
        withSpring(0, {
          damping: 8,
          mass: 0.5,
          stiffness: 1000,
          restDisplacementThreshold: 0.1,
        }),
      );
    };
    if (wrongKey) {
      shakeUI();
      setWrongKey(false);
    }
  }, [wrongKey, inputTransformValue]);
  return (
    <AuthFormContainer
      heading="Verify your account"
      subheading="Please enter your OTP Token below.">
      <View style={styles.view}>
        <Animated.View style={[styles.otpFields, inputStyle]}>
          {otpFields.map((_, index) => (
            <OTPField
              ref={otpIndex === index ? inputRef : null}
              key={`otp-field-${index}`}
              placeholder={(index + 1).toString()}
              onKeyPress={({nativeEvent}) => {
                keyPressHandler(nativeEvent.key, index);
              }}
              onChangeText={pasteHandler}
              value={otp[index] || ''}
            />
          ))}
        </Animated.View>
        <AppButton busy={isSubmitting} title="Submit" onPress={submitHandler} />

        <View style={styles.linksContainer}>
          <ReverificationLink
            linkTitle="Resend OTP"
            userId={user?._id}
            setOtp={setOtp}
            setOtpIndex={setOtpIndex}
            setIsSubmitting={setIsSubmitting}
          />
        </View>
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    width: '100%',
  },
  otpFields: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  countdown: {
    color: colors.INACTIVE_CONTRAST,
    marginRight: 12,
  },
});

export default VerifyEmail;
