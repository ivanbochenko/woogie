import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, FlatList, ImageBackground } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { s, m, l, xl } from '../constants/Spaces';
import { height, width } from '../constants/Layout';
import { RegularText, BoldText } from '../components/StyledText'
import { Icon } from '../components/Themed'
import User from '../components/User'

const CIRCLE_RADIUS = 100

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
  author: string,
  distance: number,
  latitude: number,
  longitude: number,
  matches: {user: User}[]
}

export const Card = (props: Event) => {
  const { colors } = useTheme()
  const { title, text, time, photo, author, matches, distance, latitude, longitude } = props
  const users = matches?.map(item => item?.user)
  const image = photo ? {uri: photo} : require('../assets/images/placeholder.png')
  return (
    <SafeAreaView style={{backgroundColor: colors.card, borderRadius: l, overflow: 'hidden', width: width-m, height: height-120-l}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}
        bounces={false}
      >
        <ImageBackground source={image} style={{height: height-120-l, justifyContent: 'flex-end'}}>
          <LinearGradient
            colors={['black', 'transparent']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
          >
            <View style={styles.headRow}>
              <BoldText style={{ fontSize: l, color: 'white', maxWidth: width-xl*3 }}>{title}</BoldText>
              <View style={[styles.distance, styles.row, {backgroundColor: colors.border}]}>
                <Icon style={{marginRight: s}} name="map-marker" />
                <RegularText>{distance} km</RegularText>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={{paddingHorizontal: s*3}}>
          <View style={{paddingTop: s*3}}/>
          <BoldText>{new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")}</BoldText>
          <View style={{paddingTop: s*3}}/>
          <RegularText>{text}</RegularText>
          <View style={{paddingTop: s*3}}/>
          <FlatList
            showsHorizontalScrollIndicator={false}
            overScrollMode={'never'}
            horizontal={true}
            data={[author, ...users]}
            renderItem={({item}) => {
              const user = {...(item as object)} as {
                id: string,
                avatar: string,
                name: string,
              }
              return <User {...user}/>
            }}
          />
          <View style={{paddingTop: s*3}}/>
          <MapView
            style={styles.map}
            scrollEnabled={false}
            initialRegion={{
              latitude: latitude!,
              longitude: longitude!,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: latitude!, longitude: longitude! }} >
              <Icon name="map-pin" />
            </Marker>
          </MapView>
          <View style={{paddingTop: s*3}}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export const Stack = (props: {
  events: Event[],
  children: JSX.Element,
  onSwipeRight: (id:string) => void,
  onSwipeLeft: (id:string) => void,
}) => {
  const {events, children, onSwipeRight, onSwipeLeft} = props
  const [remainingEvents, setRemainingEvents] = useState(events)
  useEffect(() => {
    setRemainingEvents(events)
  }, [events])
  

  const onRelease = (swipedRight: boolean) => {
    const { id } = remainingEvents[0]
    if (swipedRight) {
      onSwipeRight(id)
    } else {
      onSwipeLeft(id)
    }
    setTimeout(() => {
      setRemainingEvents(events => events.slice(1))
      translateX.value = 0
    }, 100)
  }

  // Swipe gesturehandler
  const translateX = useSharedValue(0)

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context: any) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context: any) => {
      translateX.value = event.translationX + context.translateX;
    },
    onEnd: () => {
      const distance = Math.abs(translateX.value);

      if (distance < CIRCLE_RADIUS) {
        translateX.value = withSpring(0);
      }
      if (distance > CIRCLE_RADIUS && translateX.value > 0) {
        translateX.value = withTiming(CIRCLE_RADIUS * 5);
        runOnJS(onRelease)(true);
      }
      if (distance > CIRCLE_RADIUS && translateX.value < 0) {
        translateX.value = withTiming(CIRCLE_RADIUS * -5);
        runOnJS(onRelease)(false);
      }
    },
  });

  const FirstCard = (props: Event) => {
    const firstCardStyle = useAnimatedStyle(() => {
      'worklet'
      return {
        transform: [
          { translateX: translateX.value },
          { rotateZ: `${ translateX.value / 16 }deg` },
        ],
      }
    }
    );
    return (
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={panGestureEvent} activeOffsetX={[-20,20]}>
          <Animated.View style={firstCardStyle}>
            <Card {...props}/>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    )
  }

  const NextCard = (props: Event) => {
    const nextCardStyle = useAnimatedStyle(() => {
      'worklet'
      return {
        opacity: Math.abs(translateX.value) / 128,
        transform: [
          { 
            scale: 1 - 2 / (0.1 + Math.abs(translateX.value))
          }
        ],
      }
    });
    return (
      <Animated.View style={[{position: 'absolute'}, nextCardStyle]}>
        <Card {...props}/>
      </Animated.View>
    )
  }

  return (
    <>
      {remainingEvents[1] ? <NextCard {...remainingEvents[1]}/> : null}
      {remainingEvents[0] ? <FirstCard {...remainingEvents[0]}/> : children}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'flex-end',
  },
  headRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s*3,
    minHeight: xl*2,
  },
  distance: {
    borderRadius: l,
    padding: m,
  },
  map: {
    borderRadius: l,
    width: '100%',
    height: 200,
  },
});