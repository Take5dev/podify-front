import React, {FC, ReactNode} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';
import {useDispatch} from 'react-redux';

import colors from '@utils/colors';
import catchAsyncError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';

interface Props {
  icon?: ReactNode;
  btnLabel?: string;
  style?: StyleProp<ViewStyle>;
  onSelect(file: DocumentPickerResponse): void;
  pickerOptions: DocumentPickerOptions<SupportedPlatforms>;
}

const FileSelector: FC<Props> = ({
  style,
  icon,
  btnLabel,
  onSelect,
  pickerOptions,
}) => {
  const dispatch = useDispatch();
  const selectDocumentHandler = async () => {
    try {
      const document = await DocumentPicker.pick(pickerOptions);
      const file = document[0];
      onSelect(file);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        const errorMessage = catchAsyncError(error);
        dispatch(
          updateNotification({
            message: errorMessage,
            type: 'error',
          }),
        );
      }
    }
  };
  return (
    <Pressable
      onPress={selectDocumentHandler}
      style={[styles.btnContainer, style]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.btnLabel}>{btnLabel}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    height: 70,
  },
  btnLabel: {
    color: colors.CONTRAST,
    marginTop: 5,
  },
});

export default FileSelector;
