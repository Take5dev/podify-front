import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

import {AudioData} from 'src/@types/audio';

export interface Player {
  audioPlaying: AudioData | null;
  listPlaying: AudioData[] | [];
  rate: number;
}

const initialState: Player = {
  audioPlaying: null,
  listPlaying: [],
  rate: 1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updateAudioPlaying(
      playerState,
      {payload}: PayloadAction<AudioData | null>,
    ) {
      playerState.audioPlaying = payload;
    },
    updateListPlaying(playerState, {payload}: PayloadAction<AudioData[] | []>) {
      playerState.listPlaying = payload;
    },
    updateRate(playerState, {payload}: PayloadAction<number>) {
      playerState.rate = payload;
    },
  },
});

export const {updateAudioPlaying, updateListPlaying, updateRate} =
  playerSlice.actions;

export const getPlayerState = createSelector(
  (state: RootState) => state.player,
  playerState => {
    const {audioPlaying, listPlaying, rate} = playerState;
    return {
      audioPlaying,
      listPlaying,
      rate,
    };
  },
);

export default playerSlice.reducer;
