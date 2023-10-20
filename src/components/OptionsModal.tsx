import React, {FC} from 'react';
import {View} from 'react-native';

import BasicModalContainer from '@ui/BasicModalContainer';

type OptionItem = {
  icon: string;
  title: string;
  onPress(): void;
};

interface Props {
  visible?: boolean;
  options: OptionItem[];
  onRequestClose?(): void;
  renderItem(item: OptionItem): JSX.Element;
}

const OptionsModal: FC<Props> = ({
  visible,
  options,
  renderItem,
  onRequestClose,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      {options.map((item, index) => {
        return <View key={`options-item-${index}`}>{renderItem(item)}</View>;
      })}
    </BasicModalContainer>
  );
};

export default OptionsModal;
