import TrackPlayer, {Event} from 'react-native-track-player';

import {getClient} from './api/client';

let timeoutId: NodeJS.Timeout;

const debounce = (fun: Function, delay: number) => {
  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fun.apply(null, args);
    }, delay);
  };
};

interface StaleAudio {
  audioId: string;
  progress: number;
  date: Date;
}

const sendHistory = async (staleAudio: StaleAudio) => {
  const client = await getClient();
  await client.post('/history', {
    ...staleAudio,
  });
};

const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async e => {
    try {
      const listOfAudios = await TrackPlayer.getQueue();
      const audio = listOfAudios[e.track];
      const staleAudio = {
        audioId: audio.id,
        progress: e.position,
        date: new Date(Date.now()),
      };
      const debouncedHistory = debounce(sendHistory, 100);
      debouncedHistory(staleAudio);
    } catch (error) {
      console.log(`playbackService Error: ${error}`);
    }
  });
};

export default PlaybackService;
