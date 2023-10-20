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

const AudioListItem: FC<Props> = ({
  audio,
  onPress,
  onLongPress,
  playing = false,
}) => {
  const {poster, title, owner} = audio;
  const posterSource = poster
    ? {uri: poster}
    : require('../assets/music_small.png');
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View>
        <Image source={posterSource} style={styles.poster} />
        <PlayAnimation visible={playing} />
      </View>
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.owner}>
          {owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  poster: {
    aspectRatio: 1 / 1,
    height: 'auto',
    width: 50,
    borderRadius: 7,
    marginRight: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: '500',
  },
  owner: {
    color: colors.SECONDARY,
  },
});

export default AudioListItem;
