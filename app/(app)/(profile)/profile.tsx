import { StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { View, Pressable, Icon } from '../../../components/Themed';
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, BoldText } from '../../../components/StyledText';
import { useMutation, useQuery } from 'urql';
import { graphql } from '../../../gql'
import { useAuth } from '../../../lib/Auth'
import { useState } from 'react';
import { EditProfileView, UserData } from '../../../components/EditProfile';

export default () => {
  const router = useRouter()
  const { user, api } = useAuth()
  const id = user?.id!
  const [value, setValue] = useState({} as UserData)
  const [edit, setEdit] = useState(false)
  
  const [editProfileResult, editProfile] = useMutation(EDIT_PROFILE)

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query,
    variables: { id },
  });

  const uploadPhoto = async (uri: string) => {
    const photo = { uri, type: 'image/jpeg', name: 'photo.jpg', }
    const data = new FormData()
    data.append('file', photo as unknown as File)
    const req = await api.post('images', data, {headers: {'Content-Type': 'multipart/form-data'} })
    return req.data.image
  }

  const onSubmit = async () => {
    if (!value.name || !value.age || !value.sex) {
      Alert.alert('Add name, age and sex')
      return
    }
    const res = await uploadPhoto(value.avatar)
    await editProfile({...value, age: Number(value.age), avatar: res})
    setEdit(false)
  }

  if (fetching) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={'gray'} />
    </View>
  )

  if (error) return (
    <View style={styles.container}>
      <RegularText>Server error</RegularText>
    </View>
  )

  if (edit) {
    return <EditProfileView value={value} setValue={setValue} onSubmit={onSubmit}/>
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{alignItems: "center", padding: m}}>

        <Image style={styles.profileImg} source={
          data?.user?.avatar ? {uri: data?.user?.avatar} : require('../../../assets/images/avatar.png')
        }/>
        <BoldText style={{fontSize: 25, marginTop: m}}>
          {data?.user?.name ?? 'Name'}, {data?.user?.age ?? 'age'}
        </BoldText>
        
        <View style={[styles.row, {marginTop: m}]}>
          <View style={{ alignItems: "center", marginRight: l}}>
            <Pressable
              style={styles.circle}
              onPress={() => router.push({pathname: 'delete'})}
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
                setValue({
                  id: data?.user?.id!,
                  name: data?.user?.name!,
                  age: data?.user?.age!.toString()!,
                  bio: data?.user?.bio!,
                  sex: data?.user?.sex!,
                  avatar: data?.user?.avatar!,
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

const EDIT_PROFILE = graphql(`
  mutation EDIT_PROFILE($id: ID!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {
    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {
      id
    }
  }
`)

const query = graphql(`
  query Edit_PROFILE_QUERY($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      age
      bio
      sex
    }
  }
`)