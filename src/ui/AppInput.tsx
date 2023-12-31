import React, {FC} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

import colors from '@utils/colors';

interface Props extends TextInputProps {}

const AppInput: FC<Props> = props => {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 22.5,
    color: colors.CONTRAST,
    padding: 10,
  },
});

export default AppInput;
