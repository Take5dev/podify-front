import React, {FC} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useQueryClient} from 'react-query';

import {useFetchUserFavorites} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';

import {getPlayerState} from 'src/store/player';

import colors from '@utils/colors';

import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyList from '@ui/EmptyList';

interface Props {}

const FavoritesTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchUserFavorites();
  const {onAudioPress} = useAudioController();
  const {audioPlaying} = useSelector(getPlayerState);
  const queryClient = useQueryClient();
  const noData = !data || data.length === 0;

  const onRefreshHandler = () => {
    queryClient.invalidateQueries({
      queryKey: ['user-favorites'],
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefreshHandler}
          tintColor={colors.CONTRAST}
        />
      }>
      {noData && <EmptyList title="You have no favorites" />}
      {!noData &&
        data?.map(audio => (
          <AudioListItem
            key={`uploaded-${audio.id}`}
            audio={audio}
            playing={audio.id === audioPlaying?.id}
            onPress={() => {
              onAudioPress(audio, data);
            }}
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

export default FavoritesTab;
