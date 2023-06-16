import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  useWindowDimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Artwork03 from "../../assets/artworks/Artwork03";
import { Button } from "../../components/Button";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import Icons from "@expo/vector-icons/MaterialIcons";
import { signIn } from "../../lib/State";
import validator from "validator";
import { registerNotifications } from "../../lib/Notification";
import { s, m, l, xl } from "../../constants/Spaces";
import { AxiosError } from "axios";
import { apiClient } from "../../lib/Client";

const LOG_IN_SCREEN = {
  title: "Let's\nGet Started",
  description: "Login or register new account",
};

const LogInScreen = () => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<null | string>(null)
  const [disabled, setDisabled] = useState(false)

  const onPress = async () => {
    if (!validator.isEmail(email) || !password) {
      return setError('Enter valid email and password')
    }
    setError(null)
    const pushToken = await registerNotifications()
    try {
      const res = await apiClient.post('login/password', { email, password, pushToken })
      signIn(res.data)
    } catch (error) {
      const err = error as AxiosError
      setError(err?.response?.statusText ?? 'Wrong data, try again or restore')
    }
  }

  const onRestore = async () => {
    if (!validator.isEmail(email)) {
      return setError('Enter valid email')
    }
    setDisabled(true)
    try {
      const res = await apiClient.post('login/restore', { email })
      Alert.alert('Check your email')
    } catch (error) {
      const err = error as AxiosError
      setError(err?.response?.statusText ?? 'Wrong data')
    }
    setDisabled(false)
  }

  return (
    <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
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
            onPress={() => router.push({pathname: 'Intro2'})}
          >
            <Icons name="arrow-back-ios" size={25} color={theme.colors.text} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Artwork03 width={250} height={250} />
        </Animated.View>

        <View style={{ padding: 25 }}>
          <Animated.Text
            entering={FadeInDown.duration(1000).springify()}
            style={{
              fontFamily: 'Lato_400Regular',
              fontSize: xl,
              fontWeight: "800",
              color: theme.colors.text,
            }}
          >
            {LOG_IN_SCREEN.title}
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
            {LOG_IN_SCREEN.description}
          </Animated.Text>
          
          {error ?
            <Animated.Text
              entering={FadeInDown.duration(1000).springify()}
              style={{
                fontFamily: 'Lato_400Regular',
                opacity: 0.5,
                marginTop: m+s,
                marginBottom: m+s,
                fontSize: m+s,
                color: 'red',
              }}
            >
              {error}
            </Animated.Text>
            : <View style={{height: 52}}/>
          }

          <View style={{ alignItems: "center", gap: m+s }}>
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
                  fontFamily: 'Lato_400Regular',
                  fontSize: m+s,
                  fontWeight: "500",
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
                size={25}
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
                  fontFamily: 'Lato_400Regular',
                  fontWeight: "500",
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
                size={25}
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
            >
              <Button
                style={{backgroundColor: theme.colors.primary}}
                title="Log In"
                onPress={onPress}
              />
            </Animated.View>
            <Animated.View
              style={{flexDirection: 'row'}}
              entering={FadeInDown.delay(800).duration(1000).springify()}
            >
              <Text 
                onPress={() => router.push({pathname: 'Register'})}
                style={{
                  fontFamily: 'Lato_400Regular',
                  opacity: 0.5,
                  fontSize: m+s,
                  color: 'gray',
                  textDecorationLine: 'underline',
                }}
              >
                Register
              </Text>
              <View style={{width: s}}/>
              <Text
                disabled={disabled}
                onPress={onRestore}
                style={{
                  fontFamily: 'Lato_400Regular',
                  opacity: 0.5,
                  fontSize: m+s,
                  color: 'gray',
                  textDecorationLine: 'underline',
                }}
              >
                Restore
              </Text>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LogInScreen