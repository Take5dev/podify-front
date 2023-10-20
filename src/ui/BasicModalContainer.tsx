import React, {FC, ReactNode} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';

import colors from '@utils/colors';

interface Props {
  visible?: boolean;
  children: ReactNode;
  onRequestClose?(): void;
}

const BasicModalContainer: FC<Props> = ({
  visible,
  children,
  onRequestClose,
}) => {
  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      transparent
      animationType="slide">
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            onRequestClose && onRequestClose();
          }}
          style={styles.backdrop}
        />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
    zIndex: -1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    backgroundColor: colors.CONTRAST,
    borderRadius: 10,
    width: '90%',
    maxHeight: '50%',
    padding: 10,
  },
});

export default BasicModalContainer;
