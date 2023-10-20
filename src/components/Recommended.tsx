import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {Image, StyleSheet, Text, View} from 'react-native';

import {useFetchRecommended} from 'src/hooks/query';

import {AudiosList} from 'src/@types/audiosList';

import {getPlayerState} from 'src/store/player';

import colors from '@utils/colors';

import PulseContainer from '@ui/PulseContainer';
import GridView from '@ui/GridView';
import AudioCard from '@ui/AudioCard';

const dummyData = new Array(6).fill('');

const Recommended: FC<AudiosList> = ({onAudioPress, onAudioLongPress}) => {
  const {data = [], isLoading} = useFetchRecommended();
  const {audioPlaying} = useSelector(getPlayerState);
  const columns = 3;
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
              <View>
                <Image
                  source={require('../assets/music.png')}
                  style={styles.dummyPoster}
                />
                <View style={styles.dummyTitle} />
              </View>
            )}
          />
        </PulseContainer>
      )}
      {!isLoading && (
        <>
          <Text style={styles.title}>Recommended</Text>
          <GridView
            data={data}
            isLoading={isLoading}
            columns={columns}
            renderItem={item => (
              <AudioCard
                key={`recommended-${item.id}`}
                audio={item}
                playing={item.id === audioPlaying?.id}
                onPress={() => {
                  onAudioPress(item, data);
                }}
                onLongPress={() => {
                  onAudioLongPress(item, data);
                }}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 7.5,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginHorizontal: 7.5,
    borderRadius: 5,
  },
  dummyContainer: {
    marginTop: 15,
    paddingHorizontal: 7.5,
  },
  dummyPoster: {
    aspectRatio: 1 / 1,
    height: 'auto',
    borderRadius: 7,
    width: '100%',
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
});

export default Recommended;
