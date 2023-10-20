import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import PlayAnimation from './PlayAnimation';
import colors from '@utils/colors';

interface Props {
  title: string;
  poster?: string;
  playing?: boolean;
  onPress?(): void;
}

const RecentlyPlayedCard: FC<Props> = ({
  title,
  poster,
  onPress,
  playing = false,
}) => {
  const posterSource = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View>
        <Image source={posterSource} style={styles.poster} />
        <PlayAnimation visible={playing} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    aspectRatio: 1 / 1,
    height: 'auto',
    width: 50,
    borderRadius: 5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default RecentlyPlayedCard;
