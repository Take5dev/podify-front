import React, {FC} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import colors from '@utils/colors';

interface Props {
  color?: string;
  playing?: boolean;
  onPress?(): void;
}

const PlayPauseBtn: FC<Props> = ({
  playing,
  color = colors.PRIMARY,
  onPress,
}) => {
  return (
    <Pressable style={styles.actionBtn} onPress={onPress}>
      {!playing && <Icon name="caretright" size={24} color={color} />}
      {playing && <Icon name="pause" size={24} color={color} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: colors.CONTRAST,
    borderRadius: 22.5,
    aspectRatio: 1 / 1,
    height: 45,
    marginLeft: 5,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayPauseBtn;
