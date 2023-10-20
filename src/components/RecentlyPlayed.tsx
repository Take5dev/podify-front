import React, {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {useFetchRecentlyPlayed} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';

import {getPlayerState} from 'src/store/player';

import colors from '@utils/colors';

import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import GridView from '@ui/GridView';
import PulseContainer from '@ui/PulseContainer';

interface Props {}

const dummyData = new Array(4).fill('');

const RecentlyPlayed: FC<Props> = props => {
  const {data = [], isLoading} = useFetchRecentlyPlayed();
  const {onAudioPress} = useAudioController();
  const {audioPlaying} = useSelector(getPlayerState);
  const columns = 2;
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      {isLoading && (
        <PulseContainer>
          <View style={styles.dummyTitleView} />
          <GridView
            data={dummyData}
            isLoading={isLoading}
            columns={columns}
            renderItem={_ => (
              <View style={styles.dummyItem}>
                <View style={styles.dummyListItem}>
                  <Image
                    source={require('../assets/music.png')}
                    style={styles.dummyPoster}
                  />
                  <View style={styles.dummyTitle} />
                </View>
              </View>
            )}
          />
        </PulseContainer>
      )}
      {!isLoading && (
        <>
          <Text style={styles.title}>Recently Played</Text>
          <GridView
            isLoading={isLoading}
            columns={columns}
            data={data}
            renderItem={item => (
              <View key={`recent-${item.id}`} style={styles.listItem}>
                <RecentlyPlayedCard
                  playing={item.id === audioPlaying?.id}
                  title={item.title}
                  poster={item.poster}
                  onPress={() => onAudioPress(item, data)}
                />
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginBottom: 15,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listItem: {
    marginBottom: 10,
  },
  dummyItem: {
    marginHorizontal: 7.5,
  },
  dummyListItem: {
    backgroundColor: colors.OVERLAY,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dummyPoster: {
    aspectRatio: 1 / 1,
    height: 'auto',
    width: 50,
    borderRadius: 5,
  },
  dummyTitle: {
    marginLeft: 10,
    height: 16,
    width: 80,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
});

export default RecentlyPlayed;
