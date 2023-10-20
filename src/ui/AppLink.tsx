import React, {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import colors from '@utils/colors';

interface Props {
  active?: boolean;
  title: string;
  onPress?(): void;
}

const AppLink: FC<Props> = ({active = true, title, onPress}) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={!active ? styles.disabled : null}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default AppLink;
