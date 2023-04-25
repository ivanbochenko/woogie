import React, { useState } from 'react';
import { SafeAreaView, Alert, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useMutation } from 'urql';
import { Button } from "../../../components/Button";
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, BoldText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/Auth'
import { graphql } from '../../../gql';
import validator from 'validator';
import { useTheme } from '@react-navigation/native';
import Icons from "@expo/vector-icons/MaterialIcons";

export default () => {
  const router = useRouter()
  const theme = useTheme()
  const { api, signOut } = useAuth()
  const [deleteResult, deleteProfile] = useMutation(DELETE_PROFILE)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')

  const onDelete = async () => {
    if (validator.isEmail(email) && password) {
      setError(false)
      const { data } = await api.post('login/password', {
        email,
        password,
      })
      if (data.success) {
        await deleteProfile({id: data.id!})
        signOut()
      } else {
        setError(true)
        setErrorText('Wrong data, try again')
      }
    } else {
      setError(true)
      setErrorText('Enter valid email and password')
    }
  }

  const launchAlert = async () => {
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
          onPress: () => onDelete()
        }
      ]
    )
  }

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: m
      }}
    >
      <SafeAreaView
        style={{
          alignItems: "center",
          justifyContent: 'center',
          gap: 16
        }}
      >
        <BoldText style={{color: 'red', opacity: 0.5 }}>
          DANGER
        </BoldText>
        <RegularText>
          You are going to delete your profile with all your data
        </RegularText>
        {error ?
          <RegularText
            style={{
              fontFamily: 'Lato_400Regular',
              opacity: 0.5,
              fontSize: 16,
              color: 'red',
            }}
          >
            {errorText}
          </RegularText>
          : <View style={{height: 20}}/>
        }
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            keyboardType="email-address"
            placeholder="Your Email"
            value={email}
            onChangeText={(t) => setEmail(t.toLowerCase())}
            style={{
              fontFamily: 'Lato_400Regular',
              fontSize: 16,
              fontWeight: "500",
              color: theme.colors.text,
              paddingLeft: 48,
              paddingRight: 12,
              height: 48,
              borderRadius: 12,
              backgroundColor: theme.colors.border,
              width: "100%",
            }}
          />
          <Icons
            name="email"
            size={24}
            color={theme.colors.text}
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              opacity: 0.5,
            }}
          />
        </View>
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="Your Password"
            keyboardType="visible-password"
            value={password}
            onChangeText={(t) => setPassword(t)}
            style={{
              fontSize: 16,
              fontFamily: 'Lato_400Regular',
              fontWeight: "500",
              color: theme.colors.text,
              paddingLeft: 48,
              paddingRight: 12,
              height: 48,
              borderRadius: 12,
              backgroundColor: theme.colors.border,
              width: "100%",
            }}
          />
          <Icons
            name="lock"
            size={24}
            color={theme.colors.text}
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              opacity: 0.5,
            }}
          />
        </View>
        <Button title={'Delete'} onPress={launchAlert} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const DELETE_PROFILE = graphql(`
  mutation DELETE_PROFILE($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`)