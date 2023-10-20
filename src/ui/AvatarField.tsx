import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import colors from '@utils/colors';

interface Props {
  source?: string;
}

const avatarSize = 70;

const AvatarField: FC<Props> = ({source}) => {
  return (
    <View>
      {source && (
        <Image
          source={{
            uri: source,
          }}
          style={styles.avatar}
          resizeMode="cover"
        />
      )}
      {!source && (
        <View style={styles.avatar}>
          <Icon name="mic" size={30} color={colors.PRIMARY} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: avatarSize / 2,
    aspectRatio: 1 / 1,
    height: 'auto',
    width: avatarSize,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.CONTRAST,
  },
});

export default AvatarField;
