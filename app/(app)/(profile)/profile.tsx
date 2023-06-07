import { StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { View, Pressable, Icon } from '../../../components/Themed';
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, BoldText } from '../../../components/StyledText';
import { useMutation, useQuery } from 'urql';
import { graphql } from '../../../gql'
import { useAuth } from '../../../lib/State'
import { useState } from 'react';
import { EditProfileView, UserData } from '../../../components/EditProfile';

export default () => {
  const router = useRouter()
  const id = useAuth.use.id()
  const api = useAuth.use.api()()
  const [value, setValue] = useState({} as UserData)
  const [edit, setEdit] = useState(false)
  
  const [editProfileResult, editProfile] = useMutation(EDIT_PROFILE)

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query,
    variables: { id: id! },
  });

  const onSubmit = async () => {
    if (!value.name || !value.age || !value.sex) {
      Alert.alert('Add name, age and sex')
      return
    }
    const file = { uri: value.avatar, type: 'image/jpeg', name: 'photo.jpg'} as unknown as File
    const FD = new FormData()
    FD.append('file', file)
    const {status, data} = await api.post('images', FD, {headers: {'Content-Type': 'multipart/form-data'} })
    if (status !== 201) {
      Alert.alert(data.message)
      return
    }
    await editProfile({
      id: id!,
      name: value.name!,
      bio: value.bio!,
      sex: value.sex!,
      age: Number(value.age),
      avatar: data.image
    })
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

const EDIT_PROFILE = graphql(`
  mutation EDIT_PROFILE($id: String!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {
    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {
      id
    }
  }
`)

const query = graphql(`
  query PROFILE_QUERY($id: String!) {
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