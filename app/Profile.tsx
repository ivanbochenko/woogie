import { StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { View, Pressable, Icon } from '@/components/Themed';
import { s, m, l, xl } from '@/constants/Spaces';
import { RegularText, BoldText } from '@/components/StyledText';
import { useMutation, useQuery } from 'urql';
import { useAuth } from '@/lib/State'
import { useState } from 'react';
import { EditProfileView, UserData } from '@/components/EditProfile';
import { EDIT_PROFILE, PROFILE_QUERY } from '@/lib/queries';
import { AxiosError } from 'axios';
import { AVATAR } from '@/constants/images';

export default function Profile() {
  const router = useRouter()
  const id = useAuth.use.id()
  const api = useAuth.use.api()()
  const [value, setValue] = useState({} as UserData)
  const [edit, setEdit] = useState(false)
  
  const [editProfileResult, editProfile] = useMutation(EDIT_PROFILE)

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: PROFILE_QUERY,
    variables: { id: id! },
  });

  const onSubmit = async () => {
    if (!value.name || !value.age || !value.sex || !value.avatar) {
      return Alert.alert('Add name, age, sex and avatar')
    }
    const file = { uri: value.avatar, type: 'image/jpeg', name: 'photo.jpg'} as unknown as File
    const FD = new FormData()
    FD.append('file', file)
    try {
      const res = await api.post('images', FD, {headers: {"Content-Type": 'multipart/form-data'}})
      await editProfile({
        id: id!,
        name: value.name!,
        bio: value.bio!,
        sex: value.sex!,
        age: Number(value.age),
        avatar: res.data.image ?? ''
      })
      setEdit(false)
    } catch (error) {
      const err = error as AxiosError
      return Alert.alert(err?.response?.statusText ?? 'Explicit image')
    }
  }

  if (fetching || error) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {fetching && <ActivityIndicator size="large" color={'gray'} /> }
      {error && <RegularText>Server error</RegularText> }
    </View>
  )

  if (edit) {
    return <EditProfileView value={value} setValue={setValue} onSubmit={onSubmit}/>
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{alignItems: "center", padding: m}}>

        <Image style={styles.profileImg} source={
          data?.user?.avatar ? {uri: data?.user?.avatar} : AVATAR
        }/>
        <BoldText style={{fontSize: 25, marginTop: m}}>
          {data?.user?.name ?? 'Name'}, {data?.user?.age ?? 'age'}
        </BoldText>
        
        <View style={[styles.row, {marginTop: m}]}>
          <View style={{ alignItems: "center", marginRight: l}}>
            <Pressable
              style={styles.circle}
              onPress={() => router.push({pathname: 'Delete'})}
            >
              <Icon size={30} name={"trash"}/>
            </Pressable>
            <RegularText>{'Delete'}</RegularText>
          </View>
          <View style={{alignItems: "center", marginRight: l, marginTop: l}}>
            <Pressable
              style={styles.circle}
              onPress={() => router.push({pathname: 'Reviews', params: {user_id: id}})}
            >
              <Icon size={30} name={"star"}/>
            </Pressable>
            <RegularText style={{marginBottom: l}}>{'Reviews'}</RegularText>
          </View>
          <View style={{alignItems: "center"}}>
            <Pressable
              style={styles.circle}
              onPress={() => {
                const { id, name, age, bio, sex, avatar } = data?.user!
                const ageString = age ? age.toString() : ''
                setValue({
                  id: id!,
                  name: name!,
                  age: ageString,
                  bio: bio!,
                  sex: sex!,
                  avatar: avatar!,
                })
                setEdit(true)
              }}
            >
              <Icon size={30} name={"pencil"}/>
            </Pressable>
            <RegularText>{'Edit'}</RegularText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: xl*2,
    height: xl*2,
    borderRadius: xl,
    marginBottom: m,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImg: {
    width: l*10,
    height: l*10,
    borderRadius: l*10/2,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});