import React, {FC} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useFetchPublicPlaylists} from 'src/hooks/query';

import {
  updatePlaylistSelectedId,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';

import {PublicProfileTabsParamList} from 'src/@types/navigation';
import {Playlist} from 'src/@types/playlist';

import PlaylistItem from '@ui/PlaylistItem';

type Props = NativeStackScreenProps<
  PublicProfileTabsParamList,
  'PublicPlaylists'
>;

const PublicPlaylistsTab: FC<Props> = props => {
  const {userId} = props.route.params;
  const {data} = useFetchPublicPlaylists(userId || '');
  const dispatch = useDispatch();

  const onListPressHandler = (playlist: Playlist) => {
    dispatch(updatePlaylistSelectedId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView style={styles.container}>
      {data?.map(playlist => (
        <PlaylistItem
          onPress={() => onListPressHandler(playlist)}
          key={playlist.id}
          playlist={playlist}
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

export default PublicPlaylistsTab;
