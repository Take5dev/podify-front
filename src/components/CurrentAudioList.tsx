import React, {FC} from 'react';
import {useSelector} from 'react-redux';

import {getPlayerState} from 'src/store/player';

import useAudioController from 'src/hooks/useAudioController';

import AudioListModal from '@ui/AudioListModal';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const CurrentAudioList: FC<Props> = ({visible, onRequestClose}) => {
  const {listPlaying} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  return (
    <AudioListModal
      header="Audios on the way"
      visible={visible}
      onRequestClose={onRequestClose}
      data={listPlaying}
      onItemPressHandler={onAudioPress}
    />
  );
};

export default CurrentAudioList;
