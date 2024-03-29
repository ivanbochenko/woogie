import React, { useState } from 'react';
import { SafeAreaView, Alert, View, TextInput, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from "@/components/Button";
import { s, m, l, xl } from '@/constants/Spaces';
import { RegularText, BoldText } from '@/components/StyledText';
import { signOut, useAuth } from '@/lib/State'
import { useTheme } from '@react-navigation/native';
import Icons from "@expo/vector-icons/MaterialIcons";

export default function Delete() {
  const router = useRouter()
  const theme = useTheme()
  const app = useAuth.use.app()()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<null | string>(null)
  const styledInput = [
    styles.input,
    {
      color: theme.colors.text,
      backgroundColor: theme.colors.border
    }
  ]

  const onDelete = async () => {
    setError(null)
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
            const { error, status } = await app.password.user.delete.post({ password })
            if (error) {
              setError('Wrong data')
            }
            signOut()
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
      <SafeAreaView style={{ gap: 15, alignItems: 'center' }} >
        <View style={[styles.row, styles.center, { width: '100%', justifyContent: 'space-between'}]}>
          <TouchableOpacity
            style={[styles.center, {height: xl, width: xl}]}
            onPress={() => router.back()}
          >
            <Icons name="arrow-back-ios" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <BoldText style={styles.error}>DANGER</BoldText>
          <View style={{width: xl}}/>
        </View>
        <RegularText>
          You are going to delete your profile with all your data
        </RegularText>
        {error ?
          <RegularText style={styles.error}>{error}</RegularText>
          : <View style={{height: 20}}/>
        }
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="Your Password"
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