import React, {FC, useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';

import colors from '@utils/colors';
import {categories} from '@utils/categories';

import catchAsyncError from 'src/api/catchError';

import {updateNotification} from 'src/store/notification';

import FileSelector from '@components/FileSelector';
import CategorySelector from '@components/CategorySelector';
import AppView from '@components/AppView';

import AppButton from '@ui/AppButton';
import Progress from '@ui/Progress';

interface FormFields {
  title: string;
  category: string;
  about?: string;
  poster?: DocumentPickerResponse;
  file?: DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  category: '',
  about: '',
  file: undefined,
  poster: undefined,
};

interface Props {
  initialValues?: {
    title: string;
    category: string;
    about: string;
  };
  onSubmit(formData: FormData): void;
  uploadProgress?: number;
  isUploading?: boolean;
}

const CommonAudioSchema = {
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(3, 'Minimum Title length is 3 characters')
    .max(256, 'Title is too long'),
  about: yup.string(),
  category: yup.string().oneOf(categories, 'Invalid category'),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
};

export const CreateAudioSchema = yup.object().shape({
  ...CommonAudioSchema,
  file: yup.object().shape({
    uri: yup.string().required('Audio File is missing'),
    name: yup.string().required('Audio File is missing'),
    type: yup.string().required('Audio File is missing'),
    size: yup.number().required('Audio File is missing'),
  }),
});

export const UpdateAudioSchema = yup.object().shape({
  ...CommonAudioSchema,
});

const AudioForm: FC<Props> = ({
  initialValues,
  onSubmit,
  uploadProgress = 0,
  isUploading = false,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({
    ...defaultForm,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  const posterIcon = (
    <Icon name="image-outline" size={35} color={colors.SECONDARY} />
  );
  const audioIcon = (
    <Icon name="file-music-outline" size={35} color={colors.SECONDARY} />
  );
  const submitHandler = async () => {
    try {
      const formData = new FormData();
      let validatedData;
      if (isUpdating) {
        validatedData = await UpdateAudioSchema.validate(audioInfo);
      } else {
        validatedData = await CreateAudioSchema.validate(audioInfo);
        formData.append('audio', {
          name: validatedData.file.name,
          type: validatedData.file.type,
          uri: validatedData.file.uri,
        });
      }

      formData.append('title', validatedData.title);
      formData.append('about', validatedData.about);
      formData.append('category', validatedData.category);
      if (validatedData.poster.uri) {
        formData.append('poster', {
          name: validatedData.poster.name,
          type: validatedData.poster.type,
          uri: validatedData.poster.uri,
        });
      }

      await onSubmit(formData);
      setAudioInfo(defaultForm);
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
    if (initialValues) {
      setAudioInfo(prevState => {
        return {...prevState, ...initialValues};
      });
      setIsUpdating(true);
    }
  }, [initialValues]);

  return (
    <AppView>
      <ScrollView style={styles.container}>
        <View style={styles.fileSelectorContainer}>
          <FileSelector
            icon={posterIcon}
            btnLabel="Select Poster"
            onSelect={poster => {
              setAudioInfo(prevState => {
                return {...prevState, poster};
              });
            }}
            pickerOptions={{
              type: [types.images],
            }}
          />
          {!isUpdating && (
            <FileSelector
              icon={audioIcon}
              btnLabel="Select Audio"
              style={{marginLeft: 20}}
              onSelect={file => {
                setAudioInfo(prevState => {
                  return {...prevState, file};
                });
              }}
              pickerOptions={{
                type: [types.audio],
              }}
            />
          )}
        </View>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Title"
            style={styles.input}
            placeholderTextColor={colors.INACTIVE_CONTRAST}
            onChangeText={title => {
              setAudioInfo(prevState => {
                return {...prevState, title};
              });
            }}
            value={audioInfo.title}
          />

          <Pressable
            onPress={() => {
              setShowCategoryModal(true);
            }}
            style={styles.categorySelector}>
            <Text style={styles.categorySelectorTitle}>Category</Text>
            <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
          </Pressable>

          <TextInput
            placeholder="About"
            style={styles.input}
            placeholderTextColor={colors.INACTIVE_CONTRAST}
            numberOfLines={9}
            multiline
            onChangeText={about => {
              setAudioInfo(prevState => {
                return {...prevState, about};
              });
            }}
            value={audioInfo.about}
          />

          <CategorySelector
            visible={showCategoryModal}
            onRequestClose={() => {
              setShowCategoryModal(false);
            }}
            onSelect={item => {
              setAudioInfo(prevState => {
                return {...prevState, category: item};
              });
            }}
            title="Category:"
            data={categories}
            renderItem={item => (
              <Text style={styles.selectorLabel}>{item}</Text>
            )}
          />

          {isUploading && (
            <View style={styles.progress}>
              <Progress progress={uploadProgress} />
            </View>
          )}

          <AppButton
            busy={isUploading}
            title={isUpdating ? 'Update' : 'Upload'}
            style={styles.uploadButton}
            onPress={submitHandler}
          />
        </View>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  selectorLabel: {
    padding: 10,
    color: colors.PRIMARY,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progress: {
    marginTop: 20,
  },
  uploadButton: {
    borderRadius: 7,
    marginTop: 20,
  },
});

export default AudioForm;
