import React, {FC, ReactNode} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import colors from '@utils/colors';

import CircleUI from '@ui/CircleUI';

interface Props {
  children: ReactNode;
  heading?: string;
  subheading?: string;
}

const AuthFormContainer: FC<Props> = ({children, heading, subheading}) => {
  return (
    <View style={styles.container}>
      <CircleUI top={-100} left={-100} />
      <CircleUI top={-100} right={-100} />
      <CircleUI bottom={-100} left={-100} />
      <CircleUI bottom={-100} right={-100} />

      <Image source={require('../../assets/logo.png')} />
      <View style={[styles.marginBottom, styles.headerContainer]}>
        <Text style={styles.mainHeading}>{heading}</Text>
        <Text style={styles.subHeading}>{subheading}</Text>
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 15,
    width: '100%',
  },
  mainHeading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subHeading: {
    color: colors.CONTRAST,
    fontSize: 16,
    marginTop: 5,
  },
});

export default AuthFormContainer;
