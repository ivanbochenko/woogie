import React from 'react'
import { StyleSheet, Image, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { RegularText } from './StyledText'
import { m } from '../constants/Spaces';

export default (props: {
  avatar?: string | null | undefined,
  id: string,
  name?: string | null | undefined
}) => {
  const router = useRouter();
  const { avatar, id, name } = props
  const photo = avatar ? {uri: avatar} : require('../assets/images/avatar.png')
  return (
    <View style={styles.center}>
      <Pressable style={{borderRadius: 30}} onPress={() => router.push({pathname: "User", params: {id, review: false}})}>
        <Image style={styles.profileImg} source={photo} />
      </Pressable>
      <RegularText>{name}</RegularText>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: m,
    backfaceVisibility: 'hidden'
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
  },
});