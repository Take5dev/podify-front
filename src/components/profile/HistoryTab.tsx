import React, {FC, useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useMutation, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import {useFetchUserHistory} from 'src/hooks/query';

import {updateNotification} from 'src/store/notification';

import {HistoryAudio, HistoryData} from 'src/@types/audio';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import colors from '@utils/colors';

import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyList from '@ui/EmptyList';

interface Props {}

const HistoryTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchUserHistory();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const noData =
    !data ||
    data.length === 0 ||
    !data[0].audios ||
    data[0].audios.length === 0;
  const removeMutation = useMutation({
    mutationFn: async histories => {
      return removeHistories(histories);
    },
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<HistoryData[]>(['user-history'], oldData => {
        let newData: HistoryData[] = [];
        if (!oldData) {
          return newData;
        }
        for (let dataItem of oldData) {
          const filteredData = dataItem.audios.filter(
            item => !histories.includes(item.id),
          );
          if (filteredData.length > 0) {
            newData.push({date: dataItem.date, audios: filteredData});
          }
        }
        return newData;
      });
    },
  });

  const removeSingleHistoryHandler = async (audio: HistoryAudio) => {
    removeMutation.mutate([audio.id]);
  };

  const multipleHistoriesRemoveHandler = async () => {
    removeMutation.mutate(selectedHistories);
    unselectHistories();
  };

  const unselectHistories = () => {
    setSelectedHistories([]);
  };

  const onRefreshHandler = () => {
    queryClient.invalidateQueries({
      queryKey: 'user-history',
    });
  };

  // const onPressHandler = (audio: HistoryAudio) => {
  //   setSelectedHistories(prevState => {
  //     const newState = [...prevState];
  //     newState.push(audio.id);
  //     return newState;
  //   });
  // };

  const onLongPressHandler = (audio: HistoryAudio) => {
    setSelectedHistories(prevState => {
      const newState = [...prevState];
      if (newState.includes(audio.id)) {
        return newState.filter(item => item !== audio.id);
      } else {
        newState.push(audio.id);
      }
      return newState;
    });
  };

  const removeHistories = async (histories: string[]) => {
    try {
      const client = await getClient();
      await client.delete(`/history?audioIds=${JSON.stringify(histories)}`);
      queryClient.invalidateQueries({
        queryKey: 'user-history',
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
  };

  useEffect(() => {
    navigation.addListener('blur', unselectHistories);
    return () => {
      navigation.removeListener('blur', unselectHistories);
    };
  }, [navigation]);

  if (isLoading) {
    return (
      <ScrollView style={styles.container}>
        <AudioListLoadingUI />
      </ScrollView>
    );
  }

  return (
    <>
      {selectedHistories && selectedHistories.length > 0 && (
        <Pressable
          onPress={multipleHistoriesRemoveHandler}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove selected histories</Text>
        </Pressable>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefreshHandler}
            tintColor={colors.CONTRAST}
          />
        }
        style={styles.container}>
        {noData && <EmptyList title="You have no history" />}
        {!noData &&
          data.map((historyItem, index) => (
            <View key={`history-item-${index}`}>
              <Text style={styles.date}>{historyItem.date}</Text>
              {historyItem.audios.map((audio, audioIndex) => (
                <Pressable
                  // onPress={() => onPressHandler(audio)}
                  onLongPress={() => onLongPressHandler(audio)}
                  key={`${audio.id}-${audioIndex}`}
                  style={[
                    styles.history,
                    {
                      backgroundColor: selectedHistories.includes(audio.id)
                        ? colors.INACTIVE_CONTRAST
                        : colors.OVERLAY,
                    },
                  ]}>
                  <Text style={styles.title}>{audio.title}</Text>
                  <Pressable onPress={() => removeSingleHistoryHandler(audio)}>
                    <Icon name="close" size={20} color={colors.CONTRAST} />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  date: {
    color: colors.SECONDARY,
    marginBottom: 15,
  },
  history: {
    backgroundColor: colors.OVERLAY,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
});

export default HistoryTab;
