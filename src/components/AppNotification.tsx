import React, {FC, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

import {getNotificationState, updateNotification} from 'src/store/notification';

import colors from '@utils/colors';

interface Props {}

const AppNotification: FC<Props> = () => {
  const {message, type} = useSelector(getNotificationState);
  const dispatch = useDispatch();

  const height = useSharedValue(0);
  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  let backgroundColor = colors.ERROR;
  let textColor = colors.CONTRAST;

  if (type === 'success') {
    backgroundColor = colors.SUCCESS;
    textColor = colors.PRIMARY;
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const animate = () => {
      height.value = withTiming(45, {
        duration: 150,
      });

      timeoutId = setTimeout(() => {
        height.value = withTiming(0, {
          duration: 150,
        });
        dispatch(
          updateNotification({
            message: '',
            type,
          }),
        );
      }, 3000);
    };

    if (message) {
      animate();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, type, height, dispatch]);

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: backgroundColor},
        heightStyle,
      ]}>
      <Text style={[styles.message, {color: textColor}]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export default AppNotification;
