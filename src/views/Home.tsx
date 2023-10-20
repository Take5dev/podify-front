import React, {FC, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {AudioData} from 'src/@types/audio';
import {Playlist} from 'src/@types/playlist';

import {useFetchUserPlaylists} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';

import {updateNotification} from 'src/store/notification';
import {
  updatePlaylistSelectedId,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';

import colors from '@utils/colors';

import LatestUploads from '@components/LatestUploads';
import Recommended from '@components/Recommended';
import OptionsModal from '@components/OptionsModal';
import PlaylistModal from '@components/PlaylistModal';
import PlaylistForm, {PlaylistFormInfo} from '@components/PlaylistForm';
import AppView from '@components/AppView';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedPlaylists from '@components/RecommendedPlaylists';

interface Props {}

const Home: FC<Props> = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [activeModal, setActiveModal] = useState('');

  const playlistsData = useFetchUserPlaylists();
  const playlists = playlistsData.data || [];

  const dispatch = useDispatch();
  const {onAudioPress} = useAudioController();

  const onLongPressHandler = (item: AudioData) => {
    setSelectedAudio(item);
    setActiveModal('options');
  };
  const addToPlaylistPressHandler = () => {
    if (!selectedAudio) {
      return;
    }

    setActiveModal('playlists');
  };
  const addToFavoritePressHandler = async () => {
    if (!selectedAudio) {
      return;
    }

    try {
      const client = await getClient();
      const {data} = await client.post(`/favorite/?id=${selectedAudio.id}`);

      console.log({data});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }

    setSelectedAudio(undefined);
    setActiveModal('');
  };

  const handlePlaylistSubmit = async (value: PlaylistFormInfo) => {
    if (!value.title.trim()) {
      return;
    }
    try {
      const client = await getClient();
      const {data} = await client.post('/playlist', {
        audioId: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });
      console.log({data});

      setSelectedAudio(undefined);
      setActiveModal('');

      dispatch(
        updateNotification({
          message: 'Playlist successfully created',
          type: 'success',
        }),
      );
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

  const playlistPressHandler = async (item: Playlist) => {
    const {title, visibility} = item;

    try {
      const client = await getClient();
      const {data} = await client.patch(`/playlist/${item.id}`, {
        title,
        visibility,
        audioId: selectedAudio?.id,
      });
      console.log({data});

      setSelectedAudio(undefined);
      setActiveModal('');

      dispatch(
        updateNotification({
          message: 'Playlist successfully updated',
          type: 'success',
        }),
      );
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

  const onListPressHandler = (playlist: Playlist) => {
    dispatch(updatePlaylistSelectedId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <AppView>
      <ScrollView>
        <View style={styles.space}>
          <RecentlyPlayed />
        </View>
        <View style={styles.space}>
          <LatestUploads
            onAudioPress={onAudioPress}
            onAudioLongPress={onLongPressHandler}
          />
        </View>
        <View style={styles.space}>
          <Recommended
            onAudioPress={onAudioPress}
            onAudioLongPress={onLongPressHandler}
          />
        </View>
        <View style={styles.space}>
          <RecommendedPlaylists onListPress={onListPressHandler} />
        </View>

        <OptionsModal
          visible={activeModal === 'options'}
          onRequestClose={() => {
            setActiveModal('');
          }}
          options={[
            {
              title: 'Add to Playlist',
              icon: 'playlist-music',
              onPress: addToPlaylistPressHandler,
            },
            {
              title: 'Add to Favorite',
              icon: 'cards-heart',
              onPress: addToFavoritePressHandler,
            },
          ]}
          renderItem={item => (
            <Pressable onPress={item.onPress} style={styles.option}>
              <MCIcon name={item.icon} style={styles.optionIcon} />
              <Text style={styles.optionLabel}>{item.title}</Text>
            </Pressable>
          )}
        />
        <PlaylistModal
          visible={activeModal === 'playlists'}
          onAddPlaylist={() => {
            setActiveModal('add-playlist');
          }}
          onRequestClose={() => {
            setActiveModal('');
          }}
          playlists={playlists}
          renderItem={item => (
            <Pressable
              onPress={() => playlistPressHandler(item)}
              style={styles.option}>
              <FAIcon
                name={item.visibility === 'public' ? 'globe' : 'lock'}
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>{item.title}</Text>
            </Pressable>
          )}
        />
        <PlaylistForm
          visible={activeModal === 'add-playlist'}
          onRequestClose={() => {
            setActiveModal('playlists');
          }}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  space: {
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionIcon: {
    color: colors.PRIMARY,
    fontSize: 24,
  },
  optionLabel: {
    color: colors.PRIMARY,
    fontSize: 16,
    marginLeft: 5,
  },
});

export default Home;
