import React, {FC, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation, useQueryClient} from 'react-query';
import {useProgress} from 'react-native-track-player';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import colors from '@utils/colors';
import {mapRange} from '@utils/math';

import useAudioController from 'src/hooks/useAudioController';
import {useFetchIsFavorite} from 'src/hooks/query';

import {HomeNavigatorStackParamList} from 'src/@types/navigation';

import {getPlayerState} from 'src/store/player';
import {updateNotification} from 'src/store/notification';
import {getAuthState} from 'src/store/auth';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import AudioPlayer from './AudioPlayer';
import CurrentAudioList from './CurrentAudioList';

import PlayPauseBtn from '@ui/PlayPauseBtn';
import Loader from '@ui/Loader';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudioPlayer: FC<Props> = () => {
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const {audioPlaying} = useSelector(getPlayerState);
  const {profile} = useSelector(getAuthState);
  const {isPlaying, togglePlayPause, isBuffering} = useAudioController();
  const {data: isFavorite} = useFetchIsFavorite(audioPlaying?.id || '');
  const progress = useProgress();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {navigate} =
    useNavigation<NavigationProp<HomeNavigatorStackParamList>>();
  const poster = audioPlaying?.poster;
  const posterSource = poster ? {uri: poster} : require('../assets/music.png');

  const toggleIsFavorite = async (id: string) => {
    if (!id) {
      return;
    }
    try {
      const client = await getClient();
      await client.post(`/favorite?id=${id}`);
      queryClient.invalidateQueries({
        queryKey: ['is-favorite', id],
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async id => toggleIsFavorite(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['is-favorite', audioPlaying?.id],
        oldData => !oldData,
      );
    },
  });

  const toggleFavoriteHandler = async (id: string) => {
    toggleFavoriteMutation.mutate(id);
  };

  const onPressHandler = () => {
    togglePlayPause();
  };
  const openFullPlayerHandler = () => {
    setShowFullPlayer(true);
  };
  const closeFullPlayerHandler = () => {
    setShowFullPlayer(false);
  };
  const closePlaylistModalHandler = () => {
    setShowPlaylistModal(false);
  };
  const onListOptionPressHandler = () => {
    setShowFullPlayer(false);
    setShowPlaylistModal(true);
  };
  const onProfilePressHandler = () => {
    setShowFullPlayer(false);
    if (profile?._id === audioPlaying?.owner.id) {
      navigate('ProfileNavigator');
    } else {
      navigate('PublicProfile', {
        userId: audioPlaying?.owner.id,
      });
    }
  };
  return (
    <>
      <View
        style={[
          styles.progress,
          {
            width: `${mapRange({
              outputMin: 0,
              outputMax: 100,
              inputMin: 0,
              inputMax: progress.duration,
              inputValue: progress.position,
            })}%`,
          },
        ]}
      />
      <View style={styles.container}>
        <Image source={posterSource} style={styles.poster} />
        <Pressable onPress={openFullPlayerHandler} style={styles.content}>
          <Text style={styles.title}>{audioPlaying?.title}</Text>
          <Text style={styles.owner}>{audioPlaying?.owner.name}</Text>
        </Pressable>
        <View style={styles.actions}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => toggleFavoriteHandler(audioPlaying?.id || '')}>
            <Icon
              name={isFavorite ? 'heart' : 'hearto'}
              size={24}
              color={colors.PRIMARY}
            />
          </Pressable>
          {isBuffering && <Loader />}
          {!isBuffering && (
            <PlayPauseBtn playing={isPlaying} onPress={onPressHandler} />
          )}
        </View>
      </View>

      <AudioPlayer
        visible={showFullPlayer}
        onRequestClose={closeFullPlayerHandler}
        onListOptionPressHandler={onListOptionPressHandler}
        onProfilePressHandler={onProfilePressHandler}
      />

      <CurrentAudioList
        visible={showPlaylistModal}
        onRequestClose={closePlaylistModalHandler}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    backgroundColor: colors.SECONDARY,
    height: 2,
  },
  poster: {
    aspectRatio: 1 / 1,
    height: MiniPlayerHeight - 10,
    marginRight: 10,
    width: 'auto',
    borderRadius: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    padding: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: colors.CONTRAST,
    borderRadius: 22.5,
    aspectRatio: 1 / 1,
    height: 45,
    marginLeft: 5,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MiniAudioPlayer;
