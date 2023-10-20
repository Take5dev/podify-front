import React, {FC, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '@utils/colors';

import BasicModalContainer from '@ui/BasicModalContainer';

export interface PlaylistFormInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible?: boolean;
  onRequestClose(): void;
  onSubmit(value: PlaylistFormInfo): void;
}

const PlaylistForm: FC<Props> = ({visible, onRequestClose, onSubmit}) => {
  const [playlistInfo, setPlaylistInfo] = useState({
    title: '',
    private: false,
  });
  const togglePrivateHandler = () => {
    setPlaylistInfo(prevState => {
      const newState = {...prevState};
      newState.private = !prevState.private;
      return newState;
    });
  };
  const changeTextHandler = (value: string) => {
    setPlaylistInfo(prevState => {
      const newState = {...prevState};
      newState.title = value;
      return newState;
    });
  };
  const submitHandler = () => {
    onSubmit(playlistInfo);
    closeHandler();
  };
  const closeHandler = () => {
    setPlaylistInfo({
      title: '',
      private: false,
    });
    onRequestClose();
  };
  return (
    <BasicModalContainer visible={visible} onRequestClose={closeHandler}>
      <View>
        <Text style={styles.title}>Create new playlist</Text>
        <TextInput
          onChangeText={(value: string): void => changeTextHandler(value)}
          placeholder="Title"
          style={styles.input}
          value={playlistInfo.title}
        />
        <Pressable
          onPress={togglePrivateHandler}
          style={styles.privateSelector}>
          {playlistInfo.private ? (
            <Icon name="radiobox-marked" color={colors.PRIMARY} />
          ) : (
            <Icon name="radiobox-blank" color={colors.PRIMARY} />
          )}
          <Text style={styles.privateLabel}>Private</Text>
        </Pressable>
        <Pressable onPress={submitHandler} style={styles.submit}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
    color: colors.PRIMARY,
    height: 45,
    paddingVertical: 10,
  },
  privateSelector: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  privateLabel: {
    color: colors.PRIMARY,
    marginLeft: 5,
  },
  submit: {
    borderWidth: 0.5,
    borderColor: colors.PRIMARY,
    borderRadius: 7,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default PlaylistForm;
