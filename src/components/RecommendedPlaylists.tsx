import React, {FC} from 'react';
import {Pressable, FlatList, Image, StyleSheet, Text, View} from 'react-native';

import {useFetchRecommendedPlaylists} from 'src/hooks/query';

import {Playlist} from 'src/@types/playlist';

import colors from '@utils/colors';

interface Props {
  onListPress(item: Playlist): void;
}

const cardSize = 150;

const RecommendedPlaylists: FC<Props> = ({onListPress}) => {
  const {data, isLoading} = useFetchRecommendedPlaylists();
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Playlists</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable style={styles.card} onPress={() => onListPress(item)}>
            <Image
              source={require('../assets/music.png')}
              style={styles.image}
            />
            <View style={styles.overlay}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardTitle}>{item.count}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  card: {
    marginRight: 15,
    width: cardSize,
  },
  image: {
    aspectRatio: 1,
    borderRadius: 5,
    height: 'auto',
    width: cardSize,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  cardTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecommendedPlaylists;
