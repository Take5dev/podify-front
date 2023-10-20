import React, {FC, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '@utils/colors';

import BasicModalContainer from '@ui/BasicModalContainer';

interface Props {
  data: string[];
  visible?: boolean;
  title?: string;
  renderItem(item: string): JSX.Element;
  onSelect(item: string): void;
  onRequestClose?(): void;
}

const CategorySelector: FC<Props> = ({
  visible = false,
  title = 'Category:',
  data,
  renderItem,
  onSelect,
  onRequestClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectHandler = (item: string, index: number) => {
    setSelectedIndex(index);
    onSelect(item);
    onRequestClose && onRequestClose();
  };
  return (
    <BasicModalContainer onRequestClose={onRequestClose} visible={visible}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView>
        {data.map((item, index) => (
          <Pressable
            onPress={() => {
              selectHandler(item, index);
            }}
            key={`category-item-${index}`}
            style={styles.selectorContainer}>
            {selectedIndex === index ? (
              <Icon name="radiobox-marked" color={colors.SECONDARY} />
            ) : (
              <Icon name="radiobox-blank" color={colors.SECONDARY} />
            )}
            {renderItem(item)}
          </Pressable>
        ))}
      </ScrollView>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.SECONDARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CategorySelector;
