import React, {FC, ReactNode, useEffect} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {useFormikContext} from 'formik';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import colors from '@utils/colors';

import AppInput from '@ui/AppInput';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  name: string;
  inputLabel?: string;
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
}

const AuthInputField: FC<Props> = props => {
  const inputTransformValue = useSharedValue(0);
  const {containerStyle, inputLabel, name, rightIcon, onRightIconPress} = props;
  const {handleChange, handleBlur, values, errors, touched} = useFormikContext<{
    [key: string]: string;
  }>();
  const errorMessage = touched[name] && errors[name] ? errors[name] : '';

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: inputTransformValue.value}],
    };
  });

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
    if (errorMessage) {
      shakeUI();
    }
  }, [errorMessage, inputTransformValue]);

  return (
    <Animated.View style={[styles.container, containerStyle, inputStyle]}>
      <View style={styles.labelContainer}>
        {inputLabel && inputLabel.length > 0 && (
          <Text style={styles.label}>{inputLabel}</Text>
        )}
        {errorMessage && errorMessage.length > 0 && (
          <Text style={styles.error}>{errorMessage}</Text>
        )}
      </View>
      <View>
        <AppInput
          {...props}
          onChangeText={handleChange(name)}
          value={values[name]}
          onBlur={handleBlur(name)}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
            {rightIcon}
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
  },
  label: {
    color: colors.CONTRAST,
  },
  error: {
    color: colors.ERROR,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
    width: '100%',
  },
  rightIcon: {
    aspectRatio: 1 / 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default AuthInputField;
