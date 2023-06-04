import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Artwork03 from "../../assets/artworks/Artwork03";
import { PrimaryButton } from "../../components/Button";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import Icons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../../lib/Auth";
import validator from "validator";

const LOG_IN_SCREEN = {
  title: "Let's\nGet Started",
  description: "Login or register new account",
};

const LogInScreen = () => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const router = useRouter()
  const { signIn, api } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<null | string>(null)

  const onPress = async () => {
    if (validator.isEmail(email) && password) {
      setError(null)
      api.post('login/password', {
        email,
        password,
      }).then((res) => {
        signIn(res.data)
        return
      }).catch((err) => {
        setError('Wrong data, try again or restore')
      })
    } else {
      setError('Enter valid email and password')
    }
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
            <Icons name="arrow-back-ios" size={24} color={theme.colors.text} />
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
          <Artwork03 width={240} height={240} />
        </Animated.View>

        <View style={{ padding: 24 }}>
          <Animated.Text
            entering={FadeInDown.duration(1000).springify()}
            style={{
              fontFamily: 'Lato_400Regular',
              fontSize: 40,
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
              marginTop: 16,
              fontSize: 16,
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
                marginTop: 16,
                marginBottom: 16,
                fontSize: 16,
                color: 'red',
              }}
            >
              {error}
            </Animated.Text>
            : <View style={{height: 52}}/>
          }

          <View style={{ alignItems: "center", gap: 16 }}>
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
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                  paddingLeft: 48,
                  paddingRight: 12,
                  height: 48,
                  borderRadius: 12,
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
                  left: 12,
                  top: 12,
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
                  fontSize: 16,
                  fontFamily: 'Lato_400Regular',
                  fontWeight: "500",
                  color: theme.colors.text,
                  paddingLeft: 48,
                  paddingRight: 12,
                  height: 48,
                  borderRadius: 12,
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
                  left: 12,
                  top: 12,
                  opacity: 0.5,
                }}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
            >
              <PrimaryButton
                label="Log In"
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
                  fontSize: 16,
                  color: 'gray',
                  textDecorationLine: 'underline',
                }}
              >
                Register
              </Text>
              <View style={{width: 6}}/>
              <Text
                onPress={() => {
                  if (validator.isEmail(email)) {
                    api.post('login/restore', { email })
                      .then((res) => {
                        setError('Check your email')
                      })
                      .catch((err) => {
                        setError('Wrong data')
                      })
                  } else {
                    setError('Enter valid email')
                  }
                }}
                style={{
                  fontFamily: 'Lato_400Regular',
                  opacity: 0.5,
                  fontSize: 16,
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