import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {FormikHelpers} from 'formik';
import {useDispatch} from 'react-redux';

import {AuthStackParamList} from 'src/@types/navigation';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {updateNotification} from 'src/store/notification';

import Form from '@components/form';
import AuthFormContainer from '@components/form/AuthFormContainer';
import AuthInputField from '@components/form/AuthInputField';
import SubmitButton from '@components/form/SubmitButton';

import AppLink from '@ui/AppLink';

interface Props {}

interface ForgotPasswordInfo {
  email: string;
}

const initialAuthInfoValues = {
  email: '',
};

const ResetPasswordBodySchema = yup.object().shape({
  email: yup
    .string()
    .email('Your email is not valid')
    .required('Email is required'),
});

const ForgotPassword: FC<Props> = () => {
  const dispatch = useDispatch();
  const authInputFieldStyle = styles.marginBottom;
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const submitHandler = async (
    values: ForgotPasswordInfo,
    actions: FormikHelpers<ForgotPasswordInfo>,
  ) => {
    actions.setSubmitting(true);
    try {
      const client = await getClient();
      const {data} = await client.post('/auth/forgot', {
        ...values,
      });
      dispatch(
        updateNotification({
          message: data.message,
          type: 'success',
        }),
      );

      navigation.navigate('LogIn', {
        user: {
          email: values.email,
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
    actions.setSubmitting(false);
  };
  return (
    <AuthFormContainer
      heading="Forgot your password?"
      subheading="Don't worry! It's easy to recover.">
      <Form
        initialValues={initialAuthInfoValues}
        validationSchema={ResetPasswordBodySchema}
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
          <SubmitButton title="Send Link" />

          <View style={styles.linksContainer}>
            <AppLink
              title="Sign Up"
              onPress={() => {
                navigation.navigate('SignUp');
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

export default ForgotPassword;
