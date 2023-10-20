import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import colors from '@utils/colors';

interface Props {
  title: string;
}

const AppHeader: FC<Props> = ({title}) => {
  const {goBack, canGoBack} = useNavigation();
  if (!canGoBack()) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={goBack}>
        <Icon name="arrowleft" size={24} color={colors.CONTRAST} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.PRIMARY,
    height: 45,
  },
  title: {
    fontSize: 18,
    color: colors.CONTRAST,
  },
});

export default AppHeader;
