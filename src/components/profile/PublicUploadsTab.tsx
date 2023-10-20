import React, {FC} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {PublicProfileTabsParamList} from 'src/@types/navigation';

import {useFetchPublicUploads} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';

import {getPlayerState} from 'src/store/player';

import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyList from '@ui/EmptyList';

type Props = NativeStackScreenProps<
  PublicProfileTabsParamList,
  'PublicUploads'
>;

const PublicUploadsTab: FC<Props> = props => {
  const {userId} = props.route.params;
  const {data, isLoading} = useFetchPublicUploads(userId || '');
  const {onAudioPress} = useAudioController();
  const {audioPlaying} = useSelector(getPlayerState);

  if (isLoading) {
    return (
      <ScrollView style={styles.container}>
        <AudioListLoadingUI />
      </ScrollView>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyList title="You have no uploads" />;
  }

  return (
    <ScrollView style={styles.container}>
      {data?.map(audio => (
        <AudioListItem
          key={`public-uploaded-${audio.id}`}
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

export default PublicUploadsTab;
