import { useState } from 'react';
import { StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter, Stack } from 'expo-router';

import { View, Pressable, Icon } from '../../../components/Themed';
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, BoldText } from '../../../components/StyledText';
import { useQuery } from 'urql';
import { graphql } from '../../../gql'
import { useAuth } from '../../../lib/Auth'
import Edit from './edit'

export default () => {
  const router = useRouter();
  const { user } = useAuth()
  const isFocused = useIsFocused()
  const id = user?.id!
  const [edit, setEdit] = useState(false)
  
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query,
    variables: { id },
    pause: !isFocused
  });

  if (fetching) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={'gray'} />
    </View>
  )

  const { name, age, avatar, sex, bio } = data?.user!

  if (edit) return (
    <Edit {...{ id: id!, name: name!, age: age!, avatar: avatar!, sex: sex!, bio: bio! } }/>
    // <Edit {...data?.user! }/>
  )

  return (
    <SafeAreaView style={{flex: 1}}>
      
      {/* <Stack.Screen options={{ title: 'Profile' }} /> */}

      <ScrollView contentContainerStyle={{alignItems: "center", padding: m}}>
        <Image style={styles.profileImg} source={avatar ? {uri: avatar} : require('../../../assets/images/avatar.png')} />
        <BoldText style={{fontSize: 25, marginTop: m}}>{name ?? 'Name'}, {age ?? 'age'}</BoldText>
        
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
              onPress={() => setEdit(true)}
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

const query = graphql(`
  query PROFILE_QUERY($id: ID!) {
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