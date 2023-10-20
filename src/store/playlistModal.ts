import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

export interface PlaylistModal {
  visible: boolean;
  selectedListId?: string;
  isPrivate?: boolean;
}

const initialState: PlaylistModal = {
  visible: false,
};

const playlistModalSlice = createSlice({
  name: 'playlistModal',
  initialState,
  reducers: {
    updatePlaylistVisibility(
      playlistModalState,
      {payload}: PayloadAction<boolean>,
    ) {
      playlistModalState.visible = payload;
    },
    updatePlaylistSelectedId(
      playlistModalState,
      {payload}: PayloadAction<string | ''>,
    ) {
      playlistModalState.selectedListId = payload;
    },
    updatePlaylistPrivate(
      playlistModalState,
      {payload}: PayloadAction<boolean>,
    ) {
      playlistModalState.isPrivate = payload;
    },
  },
});

export const {
  updatePlaylistVisibility,
  updatePlaylistPrivate,
  updatePlaylistSelectedId,
} = playlistModalSlice.actions;

export const getPlaylistModalState = createSelector(
  (state: RootState) => state.playlistModal,
  playlistModalState => {
    const {visible, selectedListId, isPrivate} = playlistModalState;
    return {
      visible,
      selectedListId,
      isPrivate,
    };
  },
);

export default playlistModalSlice.reducer;
