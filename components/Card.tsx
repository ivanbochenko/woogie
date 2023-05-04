import React, { useState, useMemo } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, ImageBackground } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { s, m, l, xl } from '../constants/Spaces';
import { height, width } from '../constants/Layout';
import { RegularText, BoldText } from '../components/StyledText'
import { Icon } from '../components/Themed'
import User from '../components/User'
import Map from './Map';

const END_POSITION = 100

export const Stack = (props: {
  events: Event[],
  onSwipe(event_id: string, dismissed: boolean): void,
}) => {
  const {events, onSwipe} = props
  const [currentIndex, setCurrentIndex] = useState(0)
  const position = useSharedValue(0)
  const event_id = events[currentIndex]?.id

  const onRelease = useMemo(() => (event_id: string, swipedLeft: boolean) => {
    setTimeout(() => {
      setCurrentIndex(i => i+1)
      position.value = 0
    }, 250);
    onSwipe(event_id, swipedLeft)
  }, [])

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      e.translationX = position.value
    })
    .onUpdate((e) => {
      position.value = e.translationX
    })
    .onEnd((e) => {
      const distance = Math.abs(position.value)
      if (distance < END_POSITION) {
        position.value = withSpring(0);
      } else if (distance > END_POSITION && position.value > 0) {
        position.value = withTiming(END_POSITION * 6, {duration: 250});
        runOnJS(onRelease)(event_id, false);
      } else if (distance > END_POSITION && position.value < 0) {
        position.value = withTiming(END_POSITION * -6, {duration: 250});
        runOnJS(onRelease)(event_id, true);
      }
    })
    .activeOffsetX([-20,20]);

  const firstCardStyle = useAnimatedStyle(() => {
    'worklet'
    return {
      transform: [
        { translateX: position.value },
        { rotateZ: `${ position.value / 12 }deg` },
      ],
    }
  });

  const nextCardStyle = useAnimatedStyle(() => {
    'worklet'
    const distance = Math.abs(position.value)
    return {
      zIndex: -1,
      position: 'absolute',
      top: '0%',
      left: '0%',
      opacity: distance / 128,
      transform: [
        { scale: 1 - 2 / (0.1 + distance) }
      ],
    }
  });

  return (
    <GestureHandlerRootView>
      {events.map((event, index) => {
        if (index===currentIndex) {
          return (
            <GestureDetector key={index} gesture={panGesture}>
              <Animated.View style={firstCardStyle}>
                <Card {...event}/>
              </Animated.View>
            </GestureDetector>
          )
        } else if (index===currentIndex+1) {
          return (
            <Animated.View key={index} style={nextCardStyle}>
              <Card {...event}/>
            </Animated.View>
          )
        } else return null
      })}
    </GestureHandlerRootView>
  );
}

const Card = (props: Event) => {
  const { colors } = useTheme()
  const cardHeigth = height-height/5.6-m
  const { title, text, time, photo, author, matches, distance, latitude, longitude } = props
  const image = photo ? {uri: photo} : require('../assets/images/placeholder.png')
  const date = new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")
  const users = matches?.map(item => item.user)
  return (
    <SafeAreaView 
      style={{
        backgroundColor: colors.card,
        borderRadius: l,
        overflow: 'hidden',
        width: width-m,
        height: cardHeigth,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}
        bounces={false}
      >
        <ImageBackground source={image} style={{height: cardHeigth, justifyContent: 'flex-end'}}>
          <LinearGradient
            colors={['black', 'transparent']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: s*3,
                minHeight: xl*2,
              }}
            >
              <BoldText style={{ fontSize: l, color: 'white', maxWidth: width-xl*3 }}>{title}</BoldText>
              <View
                style={{
                  backgroundColor: colors.border,
                  borderRadius: l,
                  padding: m,
                  alignItems: 'flex-end',
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <Icon style={{marginRight: s}} name="map-marker" />
                <RegularText>{distance} km</RegularText>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={{padding: s*3, gap: s*3}}>
          <BoldText>{date}</BoldText>
          <RegularText>{text}</RegularText>
          <FlatList
            showsHorizontalScrollIndicator={false}
            overScrollMode={'never'}
            horizontal={true}
            data={[author, ...users]}
            renderItem={({item}) => <User {...item}/>}
          />
          <Map latitude={latitude} longitude={longitude} height={200}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type User = {
  id: string,
  avatar: string,
  name: string
}

type Event = {
  id: string,
  title: string,
  text: string,
  time: string,
  photo: string,
  author: User,
  distance: number,
  latitude: number,
  longitude: number,
  matches: {user: User}[]
}