import React, { useState, useMemo } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, ImageBackground, StyleSheet } from 'react-native';
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
import { useRouter } from 'expo-router';

export const Stack = (props: {
  events: any,
  onSwipe(event_id: string, dismissed: boolean): void,
}) => {
  const {events, onSwipe} = props
  const [currentIndex, setCurrentIndex] = useState(0)
  const event_id = events[currentIndex]?.id
  const position = useSharedValue(0)

  const undo = () => setCurrentIndex(i => i>0 ? i-1 : 0)

  const onRelease = useMemo(() => (event_id: string, swipedLeft: boolean) => {
    setTimeout(() => {
      setCurrentIndex(i => i+1)
      position.value = 0
    }, 250);
    onSwipe(event_id, swipedLeft)
  }, [])

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((e) => {
          e.translationX = position.value
        })
        .onUpdate((e) => {
          position.value = e.translationX
        })
        .onEnd((e) => {
          const distance = Math.abs(position.value)
          const END_POSITION = 100
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
        .activeOffsetX([-20,20]),
    [position, event_id]
  )

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
      opacity: distance / 128,
      transform: [
        { scale: 1 - 2 / (0.1 + distance) }
      ],
    }
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <View style={{flex: 1, justifyContent: 'center', marginHorizontal: s}}>
          
        {events.map((event: Event, index: number) => {
          if (index===currentIndex) {
            return (
              <Animated.View key={index} style={[firstCardStyle, {zIndex: 1, opacity: 100}]}>
                <Card {...event} undo={undo}/>
              </Animated.View>
            )
          } else if (index===currentIndex+1) {
            return (
              <Animated.View key={index} style={[nextCardStyle, {zIndex: -1, position: 'absolute'}]}>
                <Card {...event}/>
              </Animated.View>
            )
          } else return null
        })}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const Card = (props: Event & {undo?(): void}) => {
  const { colors } = useTheme()
  const router = useRouter()
  const cardHeigth = height-height/4.7
  const { id, title, text, time, photo, author, matches, distance, latitude, longitude } = props
  const image = photo ? {uri: photo} : require('../assets/images/placeholder.png')
  const date = new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")
  const users = matches?.map(item => item.user)
  return (
    <SafeAreaView 
      style={{
        backgroundColor: colors.border,
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
        <ImageBackground source={image} style={{height: cardHeigth, justifyContent: 'space-between'}}>
          <View style={styles.bar}>
            <Icon
              name='exclamation-circle'
              color="white"
              onPress={() => router.push({pathname: 'Report', params: {event_id: id}})}
            />
            <Icon name='undo' color='white' onPress={props.undo}/>
          </View>
          <LinearGradient
            colors={['black', 'transparent']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
          >
            <View style={styles.bar}>
              <BoldText style={{ color: 'white', maxWidth: width-xl*3 }}>{title}</BoldText>
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
                <Icon style={{marginRight: s}} color={colors.text} name="map-marker" />
                <RegularText>{distance} km</RegularText>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={{padding: s*3, gap: m}}>
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

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s*3,
    minHeight: xl*2,
  }
});

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