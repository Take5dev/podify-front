import React, {FC, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import colors from '@utils/colors';

interface Props {
  delay: number;
  height: number;
}

const AnimatedStroke: FC<Props> = ({delay, height}) => {
  const sharedHeight = useSharedValue(height);
  const heightStyle = useAnimatedStyle(() => ({
    height: sharedHeight.value,
  }));
  useEffect(() => {
    sharedHeight.value = withDelay(delay, withRepeat(withTiming(5), -1, true));
  }, [sharedHeight, delay]);
  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

const styles = StyleSheet.create({
  stroke: {
    backgroundColor: colors.CONTRAST,
    marginRight: 5,
    width: 4,
  },
});

export default AnimatedStroke;
