import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';

import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';

import {updateNotification} from 'src/store/notification';

import {AudioData, HistoryData} from 'src/@types/audio';
import {Playlist, PlaylistAudios} from 'src/@types/playlist';
import {PublicProfile} from 'src/@types/profile';

const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  return useQuery('latestUploads', {
    queryFn: fetchLatest,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommended = () => {
  const dispatch = useDispatch();

  return useQuery('recommended', {
    queryFn: fetchRecommended,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchUserPlaylists = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/playlist/profile');
  return data.playlists;
};

export const useFetchUserPlaylists = () => {
  const dispatch = useDispatch();

  return useQuery('user-playlists', {
    queryFn: fetchUserPlaylists,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchUserUploads = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/audios');
  return data.audios;
};

export const useFetchUserUploads = () => {
  const dispatch = useDispatch();

  return useQuery('user-uploads', {
    queryFn: fetchUserUploads,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchUserFavorites = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/favorite');
  return data.audios;
};

export const useFetchUserFavorites = () => {
  const dispatch = useDispatch();

  return useQuery('user-favorites', {
    queryFn: fetchUserFavorites,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchUserHistory = async (): Promise<HistoryData[]> => {
  const client = await getClient();
  const {data} = await client('/history');
  return data.histories;
};

export const useFetchUserHistory = () => {
  const dispatch = useDispatch();

  return useQuery('user-history', {
    queryFn: fetchUserHistory,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/history/recent');
  return data.recents;
};

export const useFetchRecentlyPlayed = () => {
  const dispatch = useDispatch();

  return useQuery('recently-played', {
    queryFn: fetchRecentlyPlayed,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchRecommendedPlaylists = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/profile/auto');
  return data.playlists;
};

export const useFetchRecommendedPlaylists = () => {
  const dispatch = useDispatch();

  return useQuery('recommended-playlists', {
    queryFn: fetchRecommendedPlaylists,
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
  });
};

const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client(`/favorite/is-fav?id=${id}`);
  return data.result;
};

export const useFetchIsFavorite = (id: string) => {
  const dispatch = useDispatch();

  return useQuery(['is-favorite', id], {
    queryFn: () => fetchIsFavorite(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
    enabled: id ? true : false,
  });
};

const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const client = await getClient();
  const {data} = await client(`/profile/${id}`);
  return data.user;
};

export const useFetchPublicProfile = (id: string) => {
  const dispatch = useDispatch();

  return useQuery(['public-profile', id], {
    queryFn: () => fetchPublicProfile(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
    enabled: id ? true : false,
  });
};

const fetchPublicUploads = async (id: string): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client(`/profile/audios/${id}`);
  return data.audios;
};

export const useFetchPublicUploads = (id: string) => {
  const dispatch = useDispatch();

  return useQuery(['public-profile-audios', id], {
    queryFn: () => fetchPublicUploads(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
    enabled: id ? true : false,
  });
};

const fetchPublicPlaylists = async (id: string): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client(`/profile/playlist/${id}`);
  return data.playlists;
};

export const useFetchPublicPlaylists = (id: string) => {
  const dispatch = useDispatch();

  return useQuery(['public-profile-playlists', id], {
    queryFn: () => fetchPublicPlaylists(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
    enabled: id ? true : false,
  });
};

const fetchPlaylistAudios = async (
  id: string,
  isPrivate: boolean,
): Promise<PlaylistAudios> => {
  const path = isPrivate
    ? `/profile/privatePlaylistAudios/${id}`
    : `/profile/playlistAudios/${id}`;
  const client = await getClient();
  const {data} = await client(path);
  return data.playlist;
};

export const useFetchPlaylistAudios = (id: string, isPrivate: boolean) => {
  const dispatch = useDispatch();

  return useQuery(['profile-playlists-audios', id], {
    queryFn: () => fetchPlaylistAudios(id, isPrivate),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
    enabled: id ? true : false,
  });
};

const fetchIsFollowing = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client(`/profile/following/${id}`);
  return data.isFollowing;
};

export const useFetchIsFollowing = (id: string) => {
  const dispatch = useDispatch();

  return useQuery(['is-following', id], {
    queryFn: () => fetchIsFollowing(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return null;
    },
    enabled: id ? true : false,
  });
};
