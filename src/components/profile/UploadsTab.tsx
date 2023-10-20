import React, {FC, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import {useFetchUserUploads} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';

import {getPlayerState} from 'src/store/player';

import {AudioData} from 'src/@types/audio';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

import colors from '@utils/colors';

import OptionsModal from '@components/OptionsModal';

import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyList from '@ui/EmptyList';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const {data, isLoading} = useFetchUserUploads();
  const {onAudioPress} = useAudioController();
  const {audioPlaying} = useSelector(getPlayerState);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [activeModal, setActiveModal] = useState('');
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const onLongPressHandler = (audio: AudioData) => {
    setSelectedAudio(audio);
    setActiveModal('options');
  };

  const editPressHandler = () => {
    if (!selectedAudio) {
      return;
    }

    setActiveModal('');
    navigate('UpdateAudio', {
      audio: selectedAudio,
    });
  };

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
    <>
      <ScrollView style={styles.container}>
        {data?.map(audio => (
          <AudioListItem
            key={`uploaded-${audio.id}`}
            audio={audio}
            playing={audio.id === audioPlaying?.id}
            onPress={() => {
              onAudioPress(audio, data);
            }}
            onLongPress={() => onLongPressHandler(audio)}
          />
        ))}
      </ScrollView>
      <OptionsModal
        visible={activeModal === 'options'}
        onRequestClose={() => {
          setActiveModal('');
        }}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: editPressHandler,
          },
        ]}
        renderItem={item => (
          <Pressable onPress={item.onPress} style={styles.option}>
            <Icon name={item.icon} style={styles.optionIcon} />
            <Text style={styles.optionLabel}>{item.title}</Text>
          </Pressable>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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

export default UploadsTab;
