import React, {FC} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';

import {useFetchUserPlaylists} from 'src/hooks/query';

import {Playlist} from 'src/@types/playlist';

import {
  updatePlaylistPrivate,
  updatePlaylistSelectedId,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';

import colors from '@utils/colors';

import PlaylistItem from '@ui/PlaylistItem';
import EmptyList from '@ui/EmptyList';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';

interface Props {}

const PlaylistsTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchUserPlaylists();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const noData = !data || data.length === 0;

  const onListPressHandler = (playlist: Playlist) => {
    dispatch(updatePlaylistPrivate(playlist.visibility === 'private'));
    dispatch(updatePlaylistSelectedId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  const onRefreshHandler = () => {
    queryClient.invalidateQueries({
      queryKey: ['user-playlists'],
    });
  };

  if (isLoading) {
    return (
      <ScrollView style={styles.container}>
        <AudioListLoadingUI />
      </ScrollView>
    );
  }

  return (
    // <PaginatedList
    //   data={data}
    //   hasMore
    //   isFetching
    //   onEndReached={}
    //   onRefresh={}
    //   refreshing
    //   listEmptyComponent={<EmptyList title="You have no playlists" />}
    //   renderItem={({playlist}) => (
    //     <PlaylistItem
    //       key={playlist.id}
    //       playlist={playlist}
    //       onPress={() => onListPressHandler(playlist)}
    //     />
    //   )}
    // />
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefreshHandler}
          tintColor={colors.CONTRAST}
        />
      }>
      {noData && <EmptyList title="You have no playlists" />}
      {!noData &&
        data?.map(playlist => (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            onPress={() => onListPressHandler(playlist)}
          />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export default PlaylistsTab;
