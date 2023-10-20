import React, {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {Playlist} from 'src/@types/playlist';

import colors from '@utils/colors';

import BasicModalContainer from '@ui/BasicModalContainer';

interface Props {
  visible?: boolean;
  playlists: Playlist[];
  onRequestClose?(): void;
  onAddPlaylist?(): void;
  renderItem(item: Playlist): JSX.Element;
}

const PlaylistModal: FC<Props> = ({
  visible,
  playlists,
  renderItem,
  onRequestClose,
  onAddPlaylist,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {playlists.map(item => (
          <View key={item.id}>{renderItem(item)}</View>
        ))}
      </ScrollView>
      <Pressable onPress={onAddPlaylist} style={styles.option}>
        <Icon name="plus" style={styles.optionIcon} />
        <Text style={styles.optionLabel}>Create New Playlist</Text>
      </Pressable>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
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

export default PlaylistModal;
