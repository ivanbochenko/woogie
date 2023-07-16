import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  useWindowDimensions,
  Alert,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter, Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import validator from "validator";
import { PrimaryButton } from "@/components/Button";
import Icons from "@expo/vector-icons/MaterialIcons";
import { signIn } from "@/lib/State";
import { registerNotifications } from '@/lib/Notification'
import { SafeAreaView } from "react-native-safe-area-context";
import { AxiosError } from "axios";
import { s, m, l, xl } from "@/constants/Spaces";
import { apiClient } from "@/lib/Client";

const REGISTER_SCREEN = {
  title: "Let's\nGet Started",
  description: "To register for an account, enter your details",
};

const termsUrl = 'https://www.termsfeed.com/live/7dfca65f-69df-48fb-bc8c-837f6df38b68'

export default () => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>()

  const isStrong = (pass: string) => validator.isStrongPassword(pass, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  })

  useEffect(() => {
    setError(null)
    if (!email && !password) return
    if (!validator.isEmail(email)) {
      return setError('Enter valid email')
    }
    if (!password) return
    if (!isStrong(password)) {
      return setError('Password min length of 8, one uppercase and one number')
    }
    if (password !== repeatPassword) {
      return setError('Passwords dont match')
    }
  }, [email, password, repeatPassword])
  
  
  const onPress = async () => {
    if (!validator.isEmail(email) || !isStrong(password) || password !== repeatPassword) {
      return Alert.alert('Enter valid data')
    }
    const pushToken = await registerNotifications()
    try {
      const res = await apiClient.post('login/register', { email, password, pushToken })
      signIn(res.data)
    } catch (error) {
      const err = error as AxiosError
      setError(err?.response?.statusText ?? 'Wrong data')
    }
  }

  return (
    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-128} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.card,
          minHeight: dimensions.height,
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{height: 50, width: 75, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => router.push({pathname: 'LogIn'})}
          >
            <Icons name="arrow-back-ios" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </Animated.View>  
        <View style={{ alignItems: "center", gap: m+s, padding: l+s }}>
            
          <View>
            <Animated.Text
              entering={FadeInDown.duration(1000).springify()}
              style={{
                fontFamily: 'Lato_400Regular',
                fontSize: xl,
                fontWeight: "800",
                color: theme.colors.text,
              }}
            >
              {REGISTER_SCREEN.title}
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(100).duration(1000).springify()}
              style={{
                fontFamily: 'Lato_400Regular',
                opacity: 0.5,
                marginTop: m+s,
                fontSize: m+s,
                color: theme.colors.text,
              }}
            >
              {REGISTER_SCREEN.description}
            </Animated.Text>
          </View>
            {!!error ?
              <Animated.Text
                entering={FadeInDown.duration(1000).springify()}
                style={{
                  opacity: 0.5,
                  fontSize: m+6,
                  color: 'red',
                  fontFamily: 'Lato_400Regular',
                }}
              >
                {error}
              </Animated.Text>
              : <View style={{height: l}}/>
            }
            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
              style={{ position: "relative", width: "100%" }}
            >
              <TextInput
                keyboardType="email-address"
                placeholder="Your Email"
                value={email}
                onChangeText={(t) => setEmail(t.toLowerCase())}
                style={{
                  fontSize: m+s,
                  fontWeight: "500",
                  fontFamily: 'Lato_400Regular',
                  color: theme.colors.text,
                  paddingLeft: xl,
                  paddingRight: m,
                  height: xl+m,
                  borderRadius: m,
                  backgroundColor: theme.colors.background,
                  width: "100%",
                }}
              />
              <Icons
                name="email"
                size={24}
                color={theme.colors.text}
                style={{
                  position: "absolute",
                  left: m,
                  top: m,
                  opacity: 0.5,
                }}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={{ position: "relative", width: "100%" }}
            >
              <TextInput
                placeholder="Your Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(t) => setPassword(t)}
                style={{
                  fontSize: m+s,
                  fontWeight: "500",
                  fontFamily: 'Lato_400Regular',
                  color: theme.colors.text,
                  paddingLeft: xl,
                  paddingRight: m,
                  height: xl+m,
                  borderRadius: m,
                  backgroundColor: theme.colors.background,
                  width: "100%",
                }}
              />
              <Icons
                name="lock"
                size={24}
                color={theme.colors.text}
                style={{
                  position: "absolute",
                  left: m,
                  top: m,
                  opacity: 0.5,
                }}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
              style={{ position: "relative", width: "100%" }}
            >
              <TextInput
                placeholder="Repeat Your Password"
                secureTextEntry={true}
                value={repeatPassword}
                onChangeText={(t) => setRepeatPassword(t)}
                style={{
                  fontSize: m+s,
                  fontWeight: "500",
                  fontFamily: 'Lato_400Regular',
                  color: theme.colors.text,
                  paddingLeft: xl,
                  paddingRight: m,
                  height: xl+m,
                  borderRadius: m,
                  backgroundColor: theme.colors.background,
                  width: "100%",
                }}
              />
              <Icons
                name="lock"
                size={24}
                color={theme.colors.text}
                style={{
                  position: "absolute",
                  left: m,
                  top: m,
                  opacity: 0.5,
                }}
              />
            </Animated.View>
            <Animated.Text
              entering={FadeInDown.delay(800).duration(1000).springify()}
              style={{
                fontFamily: 'Lato_400Regular',
                opacity: 0.5,
                fontSize: m+s,
                color: 'gray',
              }}
            >
              By pressing Register you agree with our <Link style={{textDecorationLine: 'underline'}} href={termsUrl}>terms</Link>
            </Animated.Text>
            <Animated.View
              entering={FadeInDown.delay(800).duration(1000).springify()}
            >
              <PrimaryButton
                title="Register"
                onPress={onPress}
              />
            </Animated.View>
          </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}