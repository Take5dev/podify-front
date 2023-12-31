import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import colors from '@utils/colors';

interface Props {
  title?: string;
}

const EmptyList: FC<Props> = ({title = 'No audios found'}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.INACTIVE_CONTRAST,
  },
});

export default EmptyList;
