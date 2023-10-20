import colors from '@utils/colors';
import React, {FC, ReactNode, useEffect} from 'react';
import {Dimensions, Modal, Pressable, StyleSheet} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: ReactNode;
  visible: boolean;
  onRequestClose(): void;
  animation?: boolean;
}

const {height} = Dimensions.get('window');

const ModalHeight = height - 150;

const AppModal: FC<Props> = ({
  children,
  visible,
  onRequestClose,
  animation,
}) => {
  const translateY = useSharedValue(ModalHeight);
  const translateStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));
  const closeHandler = () => {
    translateY.value = ModalHeight;
    onRequestClose();
  };
  const gesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY <= 0) {
        return;
      }
      translateY.value = e.translationY;
    })
    .onFinalize(e => {
      if (e.translationY <= ModalHeight / 2) {
        translateY.value = 0;
        return;
      }
      translateY.value = ModalHeight;
      runOnJS(closeHandler)();
    });

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {duration: animation ? 200 : 0});
    }
  }, [visible, animation, translateY]);
  return (
    <Modal onRequestClose={closeHandler} transparent visible={visible}>
      <GestureHandlerRootView style={styles.flex}>
        <Pressable onPress={closeHandler} style={styles.backdrop} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.modal, translateStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  modal: {
    backgroundColor: colors.PRIMARY,
    height: ModalHeight,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
  },
});

export default AppModal;
