import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

export type NotificationType = 'error' | 'success';

export interface Notification {
  message: string;
  type: NotificationType;
}

const initialState: Notification = {
  message: '',
  type: 'error',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(
      notificationState,
      {payload}: PayloadAction<Notification>,
    ) {
      notificationState.message = payload.message;
      notificationState.type = payload.type;
    },
  },
});

export const {updateNotification} = notificationSlice.actions;

export const getNotificationState = createSelector(
  (state: RootState) => state.notification,
  notificationState => {
    const {message, type} = notificationState;
    return {
      message,
      type,
    };
  },
);

export default notificationSlice.reducer;
