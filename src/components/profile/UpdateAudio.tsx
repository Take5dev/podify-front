import React, {FC, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {useQueryClient} from 'react-query';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {mapRange} from '@utils/math';

import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';

import {updateNotification} from 'src/store/notification';

import AudioForm from '@components/form/AudioForm';

type Props = NativeStackScreenProps<
  ProfileNavigatorStackParamList,
  'UpdateAudio'
>;

const UpdateAudio: FC<Props> = props => {
  const {audio} = props.route.params;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const submitHandler = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const client = await getClient({
        'Content-Type': 'multipart/form-data;',
      });
      await client.patch(`/audio/${audio.id}`, formData, {
        onUploadProgress(progressEvent) {
          const percentUploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (percentUploaded >= 100) {
            setIsUploading(false);
            dispatch(
              updateNotification({
                message: 'Your file was successfully uploaded',
                type: 'success',
              }),
            );
          }

          setUploadProgress(Math.floor(percentUploaded));
        },
      });
      queryClient.invalidateQueries({queryKey: ['user-uploads']});
      navigate('Profile');
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    }
    setIsUploading(false);
  };

  return (
    <AudioForm
      initialValues={{
        title: audio.title,
        about: audio.about || '',
        category: audio.category,
      }}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      onSubmit={submitHandler}
    />
  );
};

export default UpdateAudio;
