import React, {FC} from 'react';
import {RefreshControl, ScrollView, View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useQueryClient} from 'react-query';

import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';
import {getPlayerState} from 'src/store/player';

import {useFetchPlaylistAudios} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';

import colors from '@utils/colors';

import AppModal from '@ui/AppModal';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyList from '@ui/EmptyList';
import AudioListItem from '@ui/AudioListItem';

interface Props {}

const PlaylistAudioModal: FC<Props> = props => {
  const dispatch = useDispatch();
  const {onAudioPress} = useAudioController();
  const {audioPlaying} = useSelector(getPlayerState);
  //   const queryClient = useQueryClient();
  const {visible, selectedListId, isPrivate} = useSelector(
    getPlaylistModalState,
  );
  const {data, isLoading, isFetching} = useFetchPlaylistAudios(
    selectedListId || '',
    isPrivate || false,
  );
  const noData = !data;

  //   const onRefreshHandler = () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ['profile-playlists-audios', selectedListId],
  //     });
  //   };

  const closeHandler = () => {
    dispatch(updatePlaylistVisibility(false));
  };
  return (
    <AppModal animation visible={visible} onRequestClose={closeHandler}>
      {isLoading && (
        <View style={styles.container}>
          <AudioListLoadingUI />
        </View>
      )}
      {!isLoading && (
        <View
          style={styles.container}
          //   refreshControl={
          //     <RefreshControl
          //       refreshing={isFetching}
          //       onRefresh={onRefreshHandler}
          //       tintColor={colors.CONTRAST}
          //     />
          //   }
        >
          <Text style={styles.playlistTitle}>{data?.title}</Text>
          {noData && <EmptyList title="Playlist is empty" />}
          {!noData &&
            data.audios?.map(audio => (
              <AudioListItem
                key={`uploaded-${audio.id}`}
                audio={audio}
                playing={audio.id === audioPlaying?.id}
                onPress={() => {
                  onAudioPress(audio, data.audios);
                }}
              />
            ))}
        </View>
      )}
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  playlistTitle: {
    color: colors.CONTRAST,
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaylistAudioModal;
