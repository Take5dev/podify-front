import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  followers: number;
  followings: number;
}

interface AuthState {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  isBusy: boolean;
}

const initialState: AuthState = {
  profile: null,
  isLoggedIn: false,
  isBusy: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateProfile(authState, {payload}: PayloadAction<UserProfile | null>) {
      authState.profile = payload;
    },
    updateIsLoggedIn(authState, {payload}) {
      authState.isLoggedIn = payload;
    },
    updateBusyState(authState, {payload}: PayloadAction<boolean>) {
      authState.isBusy = payload;
    },
  },
});

export const {updateProfile, updateIsLoggedIn, updateBusyState} =
  authSlice.actions;

// export const getAuthState = createSelector(
//   (state: RootState) => state,
//   authState => authState,
// );

export const getAuthState = createSelector(
  (state: RootState) => state.auth,
  authState => {
    const {profile, isLoggedIn, isBusy} = authState;
    return {
      profile,
      isLoggedIn,
      isBusy,
    };
  },
);

export default authSlice.reducer;
