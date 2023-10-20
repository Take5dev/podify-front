import React, {FC} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {AudioData} from 'src/@types/audio';

import {getPlayerState} from 'src/store/player';

import colors from '@utils/colors';

import AppModal from './AppModal';
import AudioListItem from './AudioListItem';
import AudioListLoadingUI from './AudioListLoadingUI';

interface Props {
  loading?: boolean;
  visible: boolean;
  header?: string;
  data: AudioData[];
  onRequestClose(): void;
  onItemPressHandler(item: AudioData, data: AudioData[]): void;
}

const AudioListModal: FC<Props> = ({
  loading,
  header,
  visible,
  data,
  onItemPressHandler,
  onRequestClose,
}) => {
  const {audioPlaying} = useSelector(getPlayerState);
  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Text style={styles.header}>{header}</Text>
        {loading && <AudioListLoadingUI />}
        {!loading && (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <AudioListItem
                  onPress={() => onItemPressHandler(item, data)}
                  audio={item}
                  playing={audioPlaying?.id === item.id}
                />
              );
            }}
          />
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    paddingVertical: 10,
  },
});

export default AudioListModal;
