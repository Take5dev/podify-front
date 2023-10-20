import React, {FC, useState} from 'react';
import {useSelector} from 'react-redux';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import formatDuration from 'format-duration';
import Slider from '@react-native-community/slider';
import {useProgress} from 'react-native-track-player';
import ADIcon from 'react-native-vector-icons/AntDesign';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {getPlayerState} from 'src/store/player';

import useAudioController from 'src/hooks/useAudioController';

import colors from '@utils/colors';

import AudioInfo from './AudioInfo';

import AppModal from '@ui/AppModal';
import AppLink from '@ui/AppLink';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import PlayerController from '@ui/PlayerController';
import Loader from '@ui/Loader';
import PlaybackRateController from '@ui/PlaybackRateController';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onListOptionPressHandler?(): void;
  onProfilePressHandler?(): void;
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({
  visible,
  onRequestClose,
  onListOptionPressHandler,
  onProfilePressHandler,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const {audioPlaying, rate} = useSelector(getPlayerState);
  const {duration, position} = useProgress();
  const {
    seekTo,
    skipTo,
    togglePlayPause,
    skipToPrevious,
    skipToNext,
    setRate,
    isPlaying,
    isBuffering,
  } = useAudioController();
  const poster = audioPlaying?.poster;
  const posterSource = poster ? {uri: poster} : require('../assets/music.png');
  const updateSeekHandler = async (value: number) => {
    await seekTo(value);
  };
  const skipToHandler = async (direction: 'reverse' | 'forwards') => {
    await skipTo(direction === 'reverse' ? -10 : 10);
  };
  const previousPressHandler = async () => {
    await skipToPrevious();
  };
  const nextPressHandler = async () => {
    await skipToNext();
  };
  const setPlaybackRateHandler = async (selectedRate: number) => {
    await setRate(selectedRate);
  };
  const showInfoHandler = () => {
    setShowInfo(true);
  };
  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Pressable style={styles.infoBtn} onPress={showInfoHandler}>
          <ADIcon name="infocirlceo" size={24} color={colors.CONTRAST} />
        </Pressable>
        <AudioInfo
          visible={showInfo}
          closeHandler={setShowInfo}
          audio={audioPlaying}
        />
        <Image source={posterSource} style={styles.poster} />
        <View style={styles.content}>
          <Text style={styles.title}>{audioPlaying?.title}</Text>
          <AppLink
            title={audioPlaying?.owner.name || ''}
            onPress={onProfilePressHandler}
          />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {formattedDuration(duration * 1000)}
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            value={position}
            onSlidingComplete={updateSeekHandler}
          />
          <View style={styles.controls}>
            <PlayerController onPress={previousPressHandler}>
              <ADIcon name="stepbackward" size={24} color={colors.CONTRAST} />
            </PlayerController>
            <PlayerController onPress={() => skipToHandler('reverse')}>
              <FAIcon name="rotate-left" size={18} color={colors.CONTRAST} />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerController>
            {isBuffering && <Loader color={colors.PRIMARY} />}
            {!isBuffering && (
              <PlayPauseBtn onPress={togglePlayPause} playing={isPlaying} />
            )}
            <PlayerController onPress={() => skipToHandler('forwards')}>
              <FAIcon name="rotate-right" size={18} color={colors.CONTRAST} />
              <Text style={styles.skipText}>+10s</Text>
            </PlayerController>
            <PlayerController onPress={nextPressHandler}>
              <ADIcon name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerController>
          </View>
          <PlaybackRateController
            containerStyle={{marginTop: 20}}
            activeRate={rate}
            onPress={setPlaybackRateHandler}
          />

          <View style={styles.listOptionBtnContainer}>
            <PlayerController
              onPress={onListOptionPressHandler}
              ignoreContainer>
              <MCIcon name="playlist-music" size={24} color={colors.CONTRAST} />
            </PlayerController>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  infoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  poster: {
    aspectRatio: 1 / 1,
    height: 180,
    width: 'auto',
    borderRadius: 10,
  },
  content: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipText: {
    color: colors.CONTRAST,
    fontSize: 12,
    marginTop: 2,
  },
  listOptionBtnContainer: {
    alignItems: 'flex-end',
  },
});

export default AudioPlayer;
