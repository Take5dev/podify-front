import {useEffect} from 'react';
import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import deepEqual from 'deep-equal';

import {AudioData} from 'src/@types/audio';

import {
  getPlayerState,
  updateAudioPlaying,
  updateListPlaying,
  updateRate,
} from 'src/store/player';

let isReady = false;

const updatePlayerQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map(audio => {
    return {
      id: audio.id,
      title: audio.title,
      url: audio.file,
      artwork: audio.poster || require('../assets/music.png'),
      artist: audio.owner.name,
      genre: audio.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...lists]);
};

const useAudioController = () => {
  const {audioPlaying, listPlaying} = useSelector(getPlayerState);
  const playbackState = usePlaybackState();
  const dispatch = useDispatch();

  const isPlayerReady = playbackState !== State.None;
  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBuffering = playbackState === (State.Buffering || State.Connecting);

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    const index = data.findIndex(audio => item.id === audio.id);
    if (!isPlayerReady) {
      await updatePlayerQueue(data);
      dispatch(updateAudioPlaying(item));

      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      dispatch(updateListPlaying(data));
      return;
    }
    if (playbackState === State.Playing && audioPlaying?.id === item.id) {
      await TrackPlayer.pause();
      return;
    }

    if (playbackState === State.Paused && audioPlaying?.id === item.id) {
      const fromSameList = deepEqual(listPlaying, data);
      if (!fromSameList) {
        await TrackPlayer.reset();
        await updatePlayerQueue(data);
        await TrackPlayer.skip(index);
        dispatch(updateAudioPlaying(item));
        dispatch(updateListPlaying(data));
      }
      await TrackPlayer.play();
      return;
    }

    if (audioPlaying?.id !== item.id) {
      await TrackPlayer.pause();

      const fromSameList = deepEqual(listPlaying, data);
      if (!fromSameList) {
        await TrackPlayer.reset();
        await updatePlayerQueue(data);
        dispatch(updateListPlaying(data));
      }
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateAudioPlaying(item));
      return;
    }
  };

  const togglePlayPause = async () => {
    if (isPaused) {
      await TrackPlayer.play();
    }
    if (isPlaying) {
      await TrackPlayer.pause();
    }
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + sec);
  };

  const skipToNext = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    if (currentTrackIndex === null) {
      return;
    }
    const nextIndex = currentTrackIndex + 1;
    const nextAudio = currentList[nextIndex];
    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateAudioPlaying(listPlaying[nextIndex]));
    }
  };

  const skipToPrevious = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    if (currentTrackIndex === null) {
      return;
    }
    const previousIndex = currentTrackIndex + 1;
    const previousAudio = currentList[previousIndex];
    if (previousAudio) {
      await TrackPlayer.skipToPrevious();
      dispatch(updateAudioPlaying(listPlaying[previousIndex]));
    }
  };

  const setRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
    dispatch(updateRate(rate));
  };

  useEffect(() => {
    const setupPlayer = async () => {
      if (isReady) {
        return;
      }
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          progressUpdateEventInterval: 10,
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
        isReady = true;
      } catch (e) {
        console.log(e);
      }
    };
    setupPlayer();
  }, []);

  return {
    onAudioPress,
    togglePlayPause,
    seekTo,
    skipTo,
    skipToNext,
    skipToPrevious,
    setRate,
    isPlayerReady,
    isPlaying,
    isBuffering,
  };
};

export default useAudioController;
