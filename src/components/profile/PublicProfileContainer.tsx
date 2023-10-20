import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';

import {PublicProfile} from 'src/@types/profile';

import {updateNotification} from 'src/store/notification';

import {useFetchIsFollowing} from 'src/hooks/query';

import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';

import colors from '@utils/colors';

import AvatarField from '@ui/AvatarField';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({profile}) => {
  const {data: isFollowing} = useFetchIsFollowing(profile?.id || '');
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const toggleIsFollowing = async (id: string) => {
    if (!id) {
      return;
    }
    try {
      const client = await getClient();
      await client.post(`/profile/follower/${id}`);
      queryClient.invalidateQueries({
        queryKey: ['is-following', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['public-profile', id],
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

  const toggleFollowingMutation = useMutation({
    mutationFn: async id => toggleIsFollowing(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['is-following', profile?.id],
        oldData => !oldData,
      );
    },
  });

  const toggleFollowHandler = async (id: string) => {
    toggleFollowingMutation.mutate(id);
  };

  if (!profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.profileBottom}>
          <Text style={styles.profileFollowersText}>
            {profile.followers} followers
          </Text>
        </View>
        <Pressable
          style={styles.profileBottom}
          onPress={() => toggleFollowHandler(profile.id)}>
          <Text style={styles.profileCount}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileCount: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 5,
    color: colors.PRIMARY,
    marginRight: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  profileFollowersText: {
    color: colors.CONTRAST,
    marginRight: 5,
    paddingVertical: 2,
  },
});

export default PublicProfileContainer;
