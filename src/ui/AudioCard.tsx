import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {AudioData} from 'src/@types/audio';

import colors from '@utils/colors';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  playing?: boolean;
  onPress?(): void;
  onLongPress?(): void;
}

const AudioCard: FC<Props> = ({
  audio,
  onPress,
  onLongPress,
  playing = false,
}) => {
  const {poster, title} = audio;
  const posterSource = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View>
        <Image source={posterSource} style={styles.poster} />
        <PlayAnimation visible={playing} />
      </View>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 7.5,
    width: '100%',
  },
  poster: {
    aspectRatio: 1 / 1,
    height: 'auto',
    width: '100%',
    borderRadius: 7,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    paddingHorizontal: 5,
  },
});

export default AudioCard;
