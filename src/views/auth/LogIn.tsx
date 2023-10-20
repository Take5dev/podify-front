import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as yup from 'yup';
import {FormikHelpers} from 'formik';
import {useDispatch} from 'react-redux';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {updateIsLoggedIn, updateProfile} from 'src/store/auth';
import {updateNotification} from 'src/store/notification';

import {AuthStackParamList} from 'src/@types/navigation';

import {Keys, saveToAsyncStorage} from '@utils/asyncStorage';

import Form from '@components/form';
import AuthFormContainer from '@components/form/AuthFormContainer';
import AuthInputField from '@components/form/AuthInputField';
import SubmitButton from '@components/form/SubmitButton';

import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';

type Props = NativeStackScreenProps<AuthStackParamList, 'LogIn'>;

export interface LogInInfo {
  email: string;
  password: string;
}

const initialAuthInfoValues: LogInInfo = {
  email: '',
  password: '',
};

const LoginBodySchema = yup.object().shape({
  email: yup
    .string()
    .email('Your email is not valid')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LogIn: FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const [secureEntry, setSecureEntry] = useState(true);
  const [formikValues, setFormikValues] = useState(initialAuthInfoValues);
  const togglePasswordVisibility = () =>
    setSecureEntry(prevState => !prevState);
  const authInputFieldStyle = styles.marginBottom;
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const submitHandler = async (
    values: LogInInfo,
    actions: FormikHelpers<LogInInfo>,
  ) => {
    actions.setSubmitting(true);
    try {
      const client = await getClient();
      const {data} = await client.post('/auth/login', {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      dispatch(
        updateNotification({
          message: data.message,
          type: 'success',
        }),
      );

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
    actions.setSubmitting(false);
  };
  useEffect(() => {
    const user =
      route && route.params ? route.params.user : initialAuthInfoValues;
    const userAuthInfoValues = {
      email: user?.email || '',
      password: '',
    };
    setFormikValues(userAuthInfoValues);
  }, [route]);
  return (
    <AuthFormContainer
      heading="Welcome back!"
      subheading="Plese login to listen to some good tracks">
      <Form
        enableReinitialize={true}
        initialValues={formikValues}
        validationSchema={LoginBodySchema}
        onSubmit={submitHandler}>
        <View style={styles.view}>
          <AuthInputField
            name="email"
            inputLabel="Email *"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={authInputFieldStyle}
          />
          <AuthInputField
            name="password"
            inputLabel="Password *"
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={authInputFieldStyle}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordVisibility}
          />
          <SubmitButton title="Log In" />

          <View style={styles.linksContainer}>
            <AppLink
              title="Forgot your pasword?"
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            />
            <AppLink
              title="Sign Up"
              onPress={() => {
                navigation.navigate('SignUp');
              }}
            />
          </View>
        </View>
      </Form>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default LogIn;
