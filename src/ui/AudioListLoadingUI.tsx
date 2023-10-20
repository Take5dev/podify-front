import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import colors from '@utils/colors';

import {AudioData} from 'src/@types/audio';

import PulseContainer from './PulseContainer';

interface Props {
  items?: number;
}

const AudioListLoadingUI: FC<Props> = ({items = 8}) => {
  const dummyData: AudioData[] = new Array(items).fill('');
  return (
    <PulseContainer>
      <View>
        {dummyData.map((_, index) => (
          <View key={`dummy-${index}`} style={styles.dummyListItem}></View>
        ))}
      </View>
    </PulseContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  dummyListItem: {
    backgroundColor: colors.OVERLAY,
    borderRadius: 7,
    height: 50,
    marginBottom: 7,
    width: '100%',
  },
});

export default AudioListLoadingUI;
