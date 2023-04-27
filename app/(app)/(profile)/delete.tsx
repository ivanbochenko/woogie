import React, { useState } from 'react';
import { SafeAreaView, Alert, View, TextInput, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';
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
  const styledInput = [
    styles.input,
    {
      color: theme.colors.text,
      backgroundColor: theme.colors.border
    }
  ]
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
      keyboardVerticalOffset={-150}
      style={{
        flex: 1,
        padding: m
      }}
    >
      <SafeAreaView style={{ gap: 16, alignItems: 'center' }} >
        <View style={[styles.row, styles.center, { width: '100%', justifyContent: 'space-between'}]}>
          <TouchableOpacity
            style={[styles.center, {height: 50, width: 50}]}
            onPress={() => router.back()}
          >
            <Icons name="arrow-back-ios" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <BoldText style={styles.error}>
            DANGER
          </BoldText>
          <View style={{width: 50}}/>
        </View>
        <RegularText>
          You are going to delete your profile with all your data
        </RegularText>

        {error ?
          <RegularText style={styles.error} > {errorText} </RegularText>
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
            style={styledInput}
          />
          <Icons
            name="email"
            size={24}
            color={theme.colors.text}
            style={styles.icon}
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
            style={styledInput}
          />
          <Icons
            name="lock"
            size={24}
            color={theme.colors.text}
            style={styles.icon}
          />
        </View>
        <Button title={'Delete'} onPress={launchAlert} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
    fontWeight: "500",
    paddingLeft: 48,
    paddingRight: 12,
    height: 48,
    borderRadius: 12,
    width: "100%",
  },
  error: {
    opacity: 0.5,
    color: 'red',
  },
  icon: {
    position: "absolute",
    left: 12,
    top: 12,
    opacity: 0.5,
  },
});

const DELETE_PROFILE = graphql(`
  mutation DELETE_PROFILE($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`)