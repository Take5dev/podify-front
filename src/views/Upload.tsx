import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';

import {mapRange} from '@utils/math';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import {updateNotification} from 'src/store/notification';

import AudioForm from '@components/form/AudioForm';

interface Props {}

const Upload: FC<Props> = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const submitHandler = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const client = await getClient({
        'Content-Type': 'multipart/form-data;',
      });
      await client.post('/audio', formData, {
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
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      onSubmit={submitHandler}
    />
  );
};

export default Upload;
