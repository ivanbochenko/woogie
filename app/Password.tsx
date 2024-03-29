import React, { useState } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button } from "@/components/Button";
import { s, m, l, xl } from '@/constants/Spaces';
import { RegularText, TextInput } from '@/components/StyledText';
import { signOut, useAuth } from '@/lib/State'
import { useTheme } from '@react-navigation/native';
import validator from 'validator';
import { Icon } from '@/components/Themed';

export default () => {
  const theme = useTheme()
  const app = useAuth.use.app()()
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')
  const [error, setError] = useState<null | string>(null)

  const isStrong = (pass: string) => validator.isStrongPassword(pass, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  })

  const onReset = async () => {
    setError(null)
    if (!isStrong(newPassword)) {
      return setError('Weak password. Min length of 8, one uppercase and one number')
    }
    if (newPassword !== repeatNewPassword) {
      return setError('Passwords dont match')
    }
    const { error, status } = await app.password.reset.post({ password, newPassword })
    if (error) {
      setError('Wrong data')
    }
    signOut()
  }

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={-150}
      style={{ flex: 1, padding: m }}
    >
      <SafeAreaView style={{ gap: m, alignItems: 'center' }} >
        {error ?
          <RegularText style={styles.error}>{error}</RegularText>
          : <View style={{height: l}}/>
        }
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="Your Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(t) => setPassword(t)}
          />
          <Icon
            name="lock"
            color={theme.colors.text}
            style={styles.icon}
          />
        </View>
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="New Password"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(t) => setNewPassword(t)}
          />
          <Icon
            name="lock"
            color={theme.colors.text}
            style={styles.icon}
          />
        </View>
        <View
          style={{ position: "relative", width: "100%" }}
        >
          <TextInput
            placeholder="Repeat New Password"
            secureTextEntry={true}
            value={repeatNewPassword}
            onChangeText={(t) => setRepeatNewPassword(t)}
          />
          <Icon
            name="lock"
            color={theme.colors.text}
            style={styles.icon}
          />
        </View>
        <Button title={'Reset'} onPress={onReset} />
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
  error: {
    opacity: 0.5,
    color: 'red',
  },
  icon: {
    position: "absolute",
    right: m,
    top: l - 2,
    opacity: 0.5,
  },
});