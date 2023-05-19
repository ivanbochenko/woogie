import React, { useState } from 'react';
import { SafeAreaView, Alert, View, TextInput, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from "../../../components/Button";
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, BoldText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/Auth'
import { useTheme } from '@react-navigation/native';
import Icons from "@expo/vector-icons/MaterialIcons";

export default () => {
  const router = useRouter()
  const theme = useTheme()
  const { api, signOut } = useAuth()
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [errorText, setErrorText] = useState<null | string>(null)
  const styledInput = [
    styles.input,
    {
      color: theme.colors.text,
      backgroundColor: theme.colors.border
    }
  ]

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
            setErrorText(null)
            if (password !== repeatPassword) {
              setErrorText('Passwords dont match')
              return
            }
            const { data } = await api.post('login/delete', { password })
            if (data.success) {
              signOut()
            } else {
              setErrorText(data.message ?? 'Wrong data, try again')
            }
          }
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
          <BoldText style={styles.error}>DANGER</BoldText>
          <View style={{width: 50}}/>
        </View>
        <RegularText>
          You are going to delete your profile with all your data
        </RegularText>

        {errorText ?
          <RegularText style={styles.error}>{errorText}</RegularText>
          : <View style={{height: 20}}/>
        }
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="Your Password"
            keyboardType="visible-password"
            secureTextEntry={true}
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
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="Repeat Your Password"
            keyboardType='visible-password'
            secureTextEntry={true}
            value={repeatPassword}
            onChangeText={(t) => setRepeatPassword(t)}
            style={styledInput}
          />
          <Icons
            name="lock"
            size={24}
            color={theme.colors.text}
            style={styles.icon}
          />
        </View>
        <Button title={'Delete'} onPress={onDelete} />
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