import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {FormikHelpers} from 'formik';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {AuthStackParamList} from 'src/@types/navigation';

import {updateNotification} from 'src/store/notification';

import Form from '@components/form';
import AuthFormContainer from '@components/form/AuthFormContainer';
import AuthInputField from '@components/form/AuthInputField';
import SubmitButton from '@components/form/SubmitButton';

import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';

interface Props {}

interface AuthInfo {
  name: string;
  email: string;
  password: string;
}

const initialAuthInfoValues: AuthInfo = {
  name: '',
  email: '',
  password: '',
};

const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Name is required')
    .min(3, 'Minimum Name length is 3 characters')
    .max(256, 'Name is too long'),
  email: yup
    .string()
    .email('Your email is not valid')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Minimum Password length is 8 characters')
    .max(256, 'Password is too long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Password Must Contain al teast 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
});

const SignUp: FC<Props> = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const dispatch = useDispatch();
  const togglePasswordVisibility = () =>
    setSecureEntry(prevState => !prevState);
  const authInputFieldStyle = styles.marginBottom;
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const submitHandler = async (
    values: AuthInfo,
    actions: FormikHelpers<AuthInfo>,
  ) => {
    actions.setSubmitting(true);
    try {
      const client = await getClient();
      const {data} = await client.post('/auth/signup', {
        ...values,
      });

      navigation.navigate('VerifyEmail', {
        user: data.user,
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
    actions.setSubmitting(false);
  };
  return (
    <AuthFormContainer
      heading="Welcome!"
      subheading="Let's get started by creating your account">
      <Form
        initialValues={initialAuthInfoValues}
        validationSchema={CreateUserSchema}
        onSubmit={submitHandler}>
        <View style={styles.view}>
          <AuthInputField
            name="name"
            inputLabel="Name *"
            placeholder="Name"
            containerStyle={authInputFieldStyle}
          />
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
          <SubmitButton title="Sign Up" />

          <View style={styles.linksContainer}>
            <AppLink
              title="Forgot your pasword?"
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            />
            <AppLink
              title="Log In"
              onPress={() => {
                navigation.navigate('LogIn', {});
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

export default SignUp;
