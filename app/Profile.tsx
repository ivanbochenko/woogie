import { StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { View, Pressable, Icon } from '@/components/Themed';
import { s, m, l, xl } from '@/constants/Spaces';
import { RegularText, BoldText } from '@/components/StyledText';
import { useAuth } from '@/lib/State'
import { useState } from 'react';
import { EditProfileView, UserData } from '@/components/EditProfile';
import { AxiosError } from 'axios';
import { AVATAR } from '@/constants/images';
import { useApp } from '@/lib/useApp';

export default function Profile() {
  const router = useRouter()
  const id = useAuth.use.id()
  const app = useAuth.use.app()()
  const [value, setValue] = useState({} as UserData)
  const [edit, setEdit] = useState(false)
  
  const route = app.user[id!].get
  const { response, fetching } = useApp(route)

  if (fetching || response?.error || !response?.data ) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {fetching
        ? <ActivityIndicator size="large" color={'gray'} />
        : <RegularText>Server error</RegularText>
      }
    </View>
  )

  const onSubmit = async () => {
    if (!value.name || !value.age || !value.sex || !value.avatar) {
      return Alert.alert('Add name, age, sex and avatar')
    }
    const file = { uri: value.avatar, type: 'image/jpeg', name: 'photo.jpg'} as unknown as File
    const res = await app.photo[id!].post({ file })
    
    const { data, error } = await app.user.update.post({
      id: id!,
      name: value.name!,
      bio: value.bio!,
      sex: value.sex!,
      age: Number(value.age),
      avatar: res.data ?? ''
    })
    setEdit(false)
    if (error) {
      Alert.alert('Explicit image')
    }
  }

  if (edit) {
    return <EditProfileView value={value} setValue={setValue} onSubmit={onSubmit}/>
  }

  const { name, age, bio, sex, avatar } = response.data

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{alignItems: "center", padding: m}}>

        <Image style={styles.profileImg} source={
          avatar ? {uri: avatar} : AVATAR
        }/>
        <BoldText style={{fontSize: 25, marginTop: m}}>
          {name ?? 'Name'}, {age ?? 'age'}
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