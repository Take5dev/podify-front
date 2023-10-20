import React, {forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

import colors from '@utils/colors';

interface Props extends TextInputProps {
  ref: any;
}

const OTPField = forwardRef<TextInput, Props>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
      keyboardType="numeric"
    />
  );
});

const styles = StyleSheet.create({
  input: {
    aspectRatio: 1 / 1,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    textAlign: 'center',
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 0,
  },
});

export default OTPField;
