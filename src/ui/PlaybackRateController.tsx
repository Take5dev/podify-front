import React, {FC, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

import colors from '@utils/colors';

import PlaybackRateSelector from './PlaybackRateSelector';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  activeRate?: number;
  onPress?(rate: number): void;
}

const speedRates = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];
const selectorSize = 40;

const PlaybackRateController: FC<Props> = ({
  containerStyle,
  activeRate = 1,
  onPress,
}) => {
  const [showButton, setShowButton] = useState(true);
  const width = useSharedValue(0);
  const buttonsStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));
  const handleBtnPress = () => {
    setShowButton(false);
    width.value = withTiming(selectorSize * speedRates.length, {duration: 70});
  };
  const playbackRatePressHandler = (item: number) => {
    setShowButton(true);
    width.value = withTiming(0, {duration: 70});
    if (onPress) {
      onPress(item);
    }
  };
  return (
    <View style={[styles.container, containerStyle]}>
      {showButton && (
        <Pressable onPress={handleBtnPress}>
          <Icon name="running" color={colors.CONTRAST} size={24} />
        </Pressable>
      )}
      <Animated.View style={[styles.buttons, buttonsStyle]}>
        {speedRates.map((item, index) => (
          <PlaybackRateSelector
            key={`speed-rate-${index}`}
            value={item}
            active={activeRate.toString() === item}
            onPress={() => playbackRatePressHandler(+item)}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttons: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    overflow: 'hidden',
  },
});

export default PlaybackRateController;
