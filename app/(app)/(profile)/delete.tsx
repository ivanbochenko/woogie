import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useMutation } from 'urql';
import { Button } from "../../../components/Button";
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, BoldText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/Auth'
import { graphql } from '../../../gql';

export default () => {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const [deleteResult, deleteProfile] = useMutation(DELETE_PROFILE)
  const onDelete = async () => {
    Alert.alert(
      "",
      "Are you sure?",
      [
        {
          text: "No",
          onPress: () => router.back(),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            await deleteProfile({id: user?.id!})
            signOut()
          }
        }
      ]
    )
  }
  return (
    <SafeAreaView style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
      <Stack.Screen options={{ title: 'Delete profile' }} />
      <BoldText style={{color: 'red', opacity: 0.5, marginBottom: l}}>
        DANGER
      </BoldText>
      <RegularText style={{margin: m}}>
        You are going to delete your profile with all your data
      </RegularText>
      <Button title={'Delete'} onPress={onDelete} />
    </SafeAreaView>
  )
}

const DELETE_PROFILE = graphql(`
  mutation DELETE_PROFILE($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`)