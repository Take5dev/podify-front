import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import colors from '@utils/colors';

import {Playlist} from 'src/@types/playlist';

interface Props {
  playlist: Playlist;
  onPress?(): void;
}

const PlaylistItem: FC<Props> = ({playlist, onPress}) => {
  const {id, count, title, visibility} = playlist;
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.posterContainer}>
        <MCIcon name="playlist-music" size={30} color={colors.CONTRAST} />
      </View>
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <View style={styles.infoContainer}>
          <FAIcon
            name={visibility === 'public' ? 'globe' : 'lock'}
            style={styles.optionIcon}
          />
          <Text style={styles.count}>{`${count} ${
            count > 1 ? 'audios' : 'audio'
          }`}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  posterContainer: {
    aspectRatio: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionIcon: {
    color: colors.SECONDARY,
    fontSize: 14,
    marginRight: 8,
  },
  count: {
    color: colors.SECONDARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PlaylistItem;
