import React, {FC} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';

import colors from '@utils/colors';
import Loader from './Loader';

interface Props {
  style?: StyleProp<ViewStyle>;
  busy?: boolean;
  title: string;
  onPress?(): void;
}

const AppButton: FC<Props> = ({
  style = {borderRadius: 22.5},
  busy,
  title,
  onPress,
}) => {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      {!busy ? <Text style={styles.title}>{title}</Text> : <Loader />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
