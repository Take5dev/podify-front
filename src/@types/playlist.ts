import {AudioData} from './audio';

export interface Playlist {
  id: string;
  title: string;
  visibility: 'public' | 'private';
  count: number;
}

export interface PlaylistAudios {
  id: string;
  title: string;
  audios: AudioData[];
}
