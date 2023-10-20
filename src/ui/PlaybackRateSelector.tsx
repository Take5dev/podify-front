import React, {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import colors from '@utils/colors';

interface Props {
  selectorSize?: number;
  value: string;
  active?: boolean;
  onPress?(): void;
}

const PlaybackRateSelector: FC<Props> = ({
  selectorSize = 40,
  value,
  active,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selector,
        {width: selectorSize, height: selectorSize},
        active ? {backgroundColor: colors.SECONDARY} : undefined,
      ]}>
      <Text style={styles.selectorLabel}>{value}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  selector: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorLabel: {
    color: colors.CONTRAST,
  },
});

export default PlaybackRateSelector;
