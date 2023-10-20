import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import colors from '@utils/colors';

interface Props {
  progress: number;
}

const Progress: FC<Props> = ({progress}) => {
  return (
    <>
      <Text style={styles.title}>{`${progress}%`}</Text>
      <View style={[styles.bar, {width: `${progress}%`}]} />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  bar: {
    height: 10,
    backgroundColor: colors.CONTRAST,
    borderRadius: 5,
  },
});

export default Progress;
