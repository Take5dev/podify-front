import {AudioData} from './audio';

export type NewUser = {
  _id: string;
  name: string;
  email: string;
};

export type LogginInUser = {
  email?: string;
  password?: string;
};

export type AuthStackParamList = {
  LogIn: {
    user?: LogginInUser;
  };
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyEmail: {
    user?: NewUser;
  };
};

export type ProfileNavigatorStackParamList = {
  Profile: undefined;
  ProfileSettings: undefined;
  VerifyEmail: {
    user?: NewUser;
  };
  UpdateAudio: {audio: AudioData};
};

export type HomeNavigatorStackParamList = {
  Home: undefined;
  PublicProfile: {
    userId?: string;
  };
  ProfileNavigator: undefined;
};

export type PublicProfileTabsParamList = {
  PublicUploads: {userId?: string};
  PublicPlaylists: {userId?: string};
};
