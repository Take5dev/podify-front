import {AudioData} from './audio';

export interface AudiosList {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}
