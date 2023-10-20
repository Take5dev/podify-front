import React, {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {AudioData} from 'src/@types/audio';

import colors from '@utils/colors';

import AppLink from '@ui/AppLink';

interface Props {
  visible: boolean;
  audio: AudioData | null;
  closeHandler(state: boolean): void;
}

const AudioInfo: FC<Props> = ({visible, audio, closeHandler}) => {
  const closeInfoHandler = () => {
    closeHandler(!visible);
  };
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={closeInfoHandler} style={styles.close}>
        <Icon name="close" size={24} color={colors.CONTRAST} />
      </Pressable>
      <ScrollView>
        <View>
          <Text style={styles.title}>{audio?.title}</Text>
          <View style={styles.owner}>
            <Text style={styles.creator}>Creator: </Text>
            <AppLink title={audio?.owner.name || ''} />
          </View>
          <Text style={styles.about}>{audio?.about}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.PRIMARY,
    zIndex: 1,
    padding: 10,
  },
  close: {
    alignSelf: 'flex-end',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: colors.CONTRAST,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  creator: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  about: {
    fontSize: 16,
    color: colors.CONTRAST,
    paddingVertical: 5,
  },
});

export default AudioInfo;
