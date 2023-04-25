import { View } from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Artwork01 from "../../assets/artworks/Artwork01";
import { useTheme } from "@react-navigation/native";
import { ScreenIndicators } from "../../components/ScreenIndicators";
import { PrimaryButton } from "../../components/Button";
import { useRouter } from "expo-router";

const INTRO_SCREEN_01 = {
  title: "Connect with people around easily",
  description: "Share new experiences with others around you, make long lasting friendships and even catch crushes",
};

const IntroScreen01 = () => {
  const theme = useTheme();
  const router = useRouter()

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.card, flex: 1 }}>
      <Animated.View
        entering={FadeInUp.duration(1000).springify()}
        style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
      >
        <Artwork01 width={300} height={300} />
      </Animated.View>
      <View style={{ padding: 24 }}>
        <Animated.Text
          entering={FadeInDown.duration(1000).springify()}
          style={{
            fontSize: 40,
            fontWeight: "800",
            fontFamily: 'Lato_400Regular',
            color: theme.colors.text
          }}
        >
          {INTRO_SCREEN_01.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(100).duration(1000).springify()}
          style={{
            opacity: 0.5,
            marginTop: 16,
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Lato_400Regular',
          }}
        >
          {INTRO_SCREEN_01.description}
        </Animated.Text>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
        >
          <ScreenIndicators count={2} activeIndex={0} />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={{ alignItems: "center" }}
        >
          <PrimaryButton
            label="Next"
            onPress={() => router.push({pathname: 'Intro2'})}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen01;
