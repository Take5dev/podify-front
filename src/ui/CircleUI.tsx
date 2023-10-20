import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
  size?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

const CircleUI: FC<Props> = ({size, top, right, bottom, left}) => {
  const circleSize = size || 200;
  return (
    <View
      style={[
        styles.circlesContainer,
        {
          top,
          right,
          bottom,
          left,
          borderRadius: circleSize / 2,
          width: circleSize,
        },
      ]}>
      <View style={[styles.circle, {borderRadius: circleSize / 2}]}>
        <View style={[styles.innerCircle, {borderRadius: circleSize / 3}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circlesContainer: {
    aspectRatio: 1 / 1,
    borderRadius: 100,
    position: 'absolute',
    width: 200,
  },
  circle: {
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(238, 168, 73, 0.3)',
    borderRadius: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  innerCircle: {
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(238, 168, 73, 0.3)',
    borderRadius: 200 / 3,
    width: '66.6666666667%',
  },
});

export default CircleUI;
