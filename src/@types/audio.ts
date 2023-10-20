import {categoriesTypes} from '@utils/categories';

interface OwnerData {
  id: string;
  name: string;
}

export interface AudioData {
  id: string;
  title: string;
  about?: string;
  category: categoriesTypes;
  file: string;
  poster?: string;
  owner: OwnerData;
}

export type HistoryAudio = {
  audioId: string;
  date: string;
  id: string;
  title: string;
};

export interface HistoryData {
  audios: HistoryAudio[];
  date: string;
}
