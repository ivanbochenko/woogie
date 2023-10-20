import React, { useState, useRef, useCallback } from 'react'
import { Pressable, View, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Image, RefreshControl } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

import ReAnimated, {
  Layout,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";

import { height, width } from '@/constants/Layout';
import { s, m, l, xl } from '@/constants/Spaces';
import { useAuth } from '@/lib/State'
import { BoldText, RegularText } from '@/components/StyledText';
import { PLACEHOLDER } from '@/constants/images';
import { useApp } from '@/lib/useApp';

export default function Chats() {
  const [show, setShow] = useState(true)
  const id = useAuth.use.id()
  const app = useAuth.use.app()()
  const {colors} = useTheme()
  const user_id = id!

  // Switch
  let transformX = useRef(new Animated.Value(0)).current
  const action = (v: number) => {
    Animated.timing(transformX, {
      toValue: v,
      duration: 200,
      useNativeDriver: true
    }).start()
  }
  const rotationX = transformX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width / 2 - m]
  })

  const ShowMatches = () => {
    const route = app.matches[user_id].get
    const { response, fetching } = useApp(route)
  
    if (fetching || response?.error || !response?.data ) return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {fetching
          ? <ActivityIndicator size="large" color={'gray'} />
          : <RegularText>Server error</RegularText>
        }
      </View>
    )

    return (
      <ScrollView>
        <ReAnimated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          layout={Layout.duration(200)}
        >
          {response.data.length ?
            response.data.map((match, index) => 
              <Swipe
                key={index}
                event={match.event}
                leave={async () => await app.match.delete.post({ id: match!.id })}
              />
            )
            : <View style={{alignItems: 'center'}}><BoldText>No matches</BoldText></View>
          }
        </ReAnimated.View>
      </ScrollView>
    )
  }

  const ShowEvents = () => {
    const route = app.events[user_id].get
    const { response, fetching } = useApp(route)
  
    if (fetching || response?.error || !response?.data ) return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {fetching
          ? <ActivityIndicator size="large" color={'gray'} />
          : <RegularText>Server error</RegularText>
        }
      </View>
    )

    return (
      <ScrollView>
        <ReAnimated.View
          entering={SlideInRight}
          exiting={SlideOutRight}
          layout={Layout.duration(200)}
        >
          {response.data.length
            ? response.data.map((event, index) =>
                <Swipe
                  key={index}
                  event={event!}
                  leave={async () => await app.event.delete.post({ id: event?.id! })}
                />
              )
            : <View style={{alignItems: 'center'}}><BoldText>No events</BoldText></View>
          }
        </ReAnimated.View>
      </ScrollView>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, paddingHorizontal: m}}>
      <View style={[styles.switch, {backgroundColor: colors.card}]}>
        <Animated.View
          style={{
            position: 'absolute',
            height: xl,
            left: s,
            top: s,
            bottom: s,
            borderRadius: l,
            width: width / 2 -l-2,
            transform: [
              { translateX: rotationX }
            ],
            backgroundColor: colors.background,
          }}
        >
        </Animated.View>
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            action(0)
            setShow(true)
          }}
        >
          <RegularText>My matches</RegularText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.container} 
          onPress={() => {
            action(1)
            setShow(false)
          }}
        >
          <RegularText>My events</RegularText>
        </TouchableOpacity>
      </View>
      {show ? <ShowMatches/> : <ShowEvents/>}
    </SafeAreaView>
  )
}

const Swipe = ({ event, leave }: {
  event: {
    id: string,
    title: string,
    time: Date,
    photo: string,
  },
  leave(): void
}) => {
  const router = useRouter()
  const { colors } = useTheme()
  const { id, title, time, photo } = event
  const image = photo ? {uri: photo} : PLACEHOLDER

  const ref = useRef<Swipeable>(null)
  const onDelete = () => {
    ref.current!.close()
    leave()
  }

  const renderRightActions = (progress: any, dragX: any) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 24],
      outputRange: [0, 1],
    });
    return (
      <View style={[styles.row, {backgroundColor: colors.card, alignItems: 'center'}]}>
        <RegularText style={{flex: 1, marginLeft: m}}>Are you sure?</RegularText>
        <Animated.View style={{transform: [{ translateX }]}}>
          <FontAwesome onPress={onDelete} name="times-circle" size={60} color={colors.background}/>
        </Animated.View>
      </View>
    )
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Swipeable ref={ref} renderRightActions={renderRightActions}>
        <Pressable
          key={id}
          style={[styles.row, {backgroundColor: colors.border}]}
          onPress={() => router.push({pathname: 'Chat', params: {event_id: id, title}})}
        >
          <Image style={styles.chatImg} source={image} />
          <View style={{flex: 1}}>
            <BoldText style={{flex: 1}}>{title}</BoldText>
            <View style={{alignItems: 'flex-end'}}>
              <RegularText style={{color: 'gray', marginRight: m}}>{new Date(time).toLocaleDateString()}</RegularText>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatImg: {
    width: xl*2,
    height: xl*2,
    borderRadius: xl,
    marginRight: m,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    borderRadius: l,
    marginBottom: m,
    padding: m
  },
  switch: {
    flexDirection: 'row',
    height: xl+m,
    borderRadius: l,
    marginVertical: m,
  }
});