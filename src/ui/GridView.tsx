import React from 'react';
import {StyleSheet, View} from 'react-native';

import {AudioData} from 'src/@types/audio';

interface Props<T> {
  columns: number;
  isLoading: boolean;
  data: T[] | undefined;
  renderItem(item: T): JSX.Element;
}

const GridView = <T extends AudioData>(props: Props<T>) => {
  const {data, isLoading, columns = 2, renderItem} = props;
  return (
    <View style={styles.container}>
      {data &&
        data.map((item, index) => {
          return isLoading ? (
            <View
              key={`dummy-recommended-${index}`}
              style={[styles.gridContainer, {width: `${100 / columns}%`}]}>
              {renderItem(item)}
            </View>
          ) : (
            <View
              key={`recommended-${item.id}`}
              style={[styles.gridContainer, {width: `${100 / columns}%`}]}>
              {renderItem(item)}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridContainer: {
    marginTop: 15,
  },
});

export default GridView;
