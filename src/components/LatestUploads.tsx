import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useFetchLatestAudios} from 'src/hooks/query';

import {AudiosList} from 'src/@types/audiosList';

import {getPlayerState} from 'src/store/player';

import colors from '@utils/colors';

import PulseContainer from '@ui/PulseContainer';
import AudioCard from '@ui/AudioCard';

const dummyData = new Array(4).fill('');

const LatestUploads: FC<AudiosList> = ({onAudioPress, onAudioLongPress}) => {
  const {data, isLoading} = useFetchLatestAudios();
  const {audioPlaying} = useSelector(getPlayerState);
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      {isLoading && (
        <PulseContainer>
          <View style={styles.dummyTitleView} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.audios}>
            {dummyData.map((_, index) => (
              <View key={`dummy-audio-${index}`} style={styles.dummyContainer}>
                <Image
                  source={require('../assets/music.png')}
                  style={styles.dummyPoster}
                />
                <View style={styles.dummyTitle} />
              </View>
            ))}
          </ScrollView>
        </PulseContainer>
      )}
      {!isLoading && (
        <>
          <Text style={styles.title}>Latest uploads</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.audios}>
            {data?.map(audio => (
              <View key={audio.id} style={styles.audioCard}>
                <AudioCard
                  audio={audio}
                  playing={audio.id === audioPlaying?.id}
                  onPress={() => {
                    onAudioPress(audio, data);
                  }}
                  onLongPress={() => {
                    onAudioLongPress(audio, data);
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  dummyContainer: {
    marginRight: 15,
    marginTop: 15,
    width: 100,
  },
  dummyPoster: {
    aspectRatio: 1 / 1,
    height: 'auto',
    width: 100,
    borderRadius: 7,
  },
  dummyTitle: {
    height: 16,
    width: 80,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginTop: 10,
    marginHorizontal: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  audios: {
    paddingHorizontal: 7.5,
  },
  audioCard: {
    width: 100,
  },
});

export default LatestUploads;
