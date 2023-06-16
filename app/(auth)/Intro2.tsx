import { View, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import Artwork02 from "../../assets/artworks/Artwork02";
import { ScreenIndicators } from "../../components/ScreenIndicators";
import { Button } from "../../components/Button";
import { useRouter } from "expo-router";
import { s, m, l, xl } from "../../constants/Spaces";

const INTRO_SCREEN_02 = {
  title: "Get new social inspirations",
  description: "Go out and meet people with shared activities... or invite them over!",
};

const IntroScreen02 = () => {
  const theme = useTheme();
  const router = useRouter()
  
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.card, flex: 1 }}>
      <Animated.View
        entering={FadeInUp.duration(1000).springify()}
        style={{
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{height: 50, width: 75, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => router.push({pathname: 'Intro1'})}
        >
          <Icons name="arrow-back-ios" size={25} color={theme.colors.text} />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
      >
        <Artwork02 width={300} height={300} />
      </Animated.View>
      <View style={{ padding: 25 }}>
        <Animated.Text
          entering={FadeInDown.duration(1000).springify()}
          style={{
            fontFamily: 'Lato_400Regular',
            fontSize: xl,
            fontWeight: "800",
            color: theme.colors.text
          }}
        >
          {INTRO_SCREEN_02.title}
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
          {INTRO_SCREEN_02.description}
        </Animated.Text>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
        >
          <ScreenIndicators count={2} activeIndex={1} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={{ alignItems: "center" }}
        >
          <Button
            title="Next"
            onPress={() => router.push({pathname: 'LogIn'})}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen02;
