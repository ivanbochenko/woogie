import React, { useState, useRef, useCallback } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Image, RefreshControl } from 'react-native'
import { useQuery, useMutation } from 'urql';
import { useIsFocused, useTheme } from '@react-navigation/native';
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

import { height, width } from '../../../constants/Layout';
import { s, m, l, xl } from '../../../constants/Spaces';
import { useAuth } from '../../../lib/Auth'
import { View, Pressable } from '../../../components/Themed';
import { BoldText, RegularText } from '../../../components/StyledText';
import { graphql } from '../../../gql';

export default function Chats() {
  const isFocused = useIsFocused()
  const [show, setShow] = useState(true)
  const { user } = useAuth()
  const {colors} = useTheme()
  const user_id = useRef(user?.id!).current

  const [deleteEventResult, deleteEvent] = useMutation(DELETE_EVENT)
  const [deleteMatchResult, deleteMatch] = useMutation(DELETE_MATCH)

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

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = useCallback(() => {
      setRefreshing(true)
      refreshMatches({requestPolicy: 'cache-and-network'})
      setRefreshing(false)
    }, []);

    const [matches, refreshMatches] = useQuery({
      query: MY_MATCHES,
      variables: { user_id },
      pause: !isFocused
    });

    if (matches.fetching) {
      return (
        <View style={[styles.container, {width, height: 100}]}>
          <ActivityIndicator size="large" color={'gray'} />
        </View>
      )
    }
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ReAnimated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          layout={Layout.duration(200)}
        >
          {matches.data?.matches!.length ? matches.data.matches.map( (match: any) => (
            <Swipe
              key={match.id}
              event={match.event}
              leave={async () => await deleteMatch({ id: match.id })}
            />
            )) : <View style={{alignItems: 'center'}}><BoldText>No matches</BoldText></View>}
        </ReAnimated.View>
      </ScrollView>
    )
  }

  const ShowEvents = () => {
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
      setRefreshing(true)
      refreshEvents({requestPolicy: 'cache-and-network'})
      setRefreshing(false)
    }, []);

    const [events, refreshEvents] = useQuery({
      query: MY_EVENTS,
      variables: { author_id: user_id },
      pause: !isFocused
    });
    
    if (events.fetching) {
      return (
        <View style={[styles.container, {width, height: 100}]}>
          <ActivityIndicator size="large" color={'gray'} />
        </View>
      )
    }

    return (
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ReAnimated.View
          entering={SlideInRight}
          exiting={SlideOutRight}
          layout={Layout.duration(200)}
        >
          {events.data?.events!.length
            ? events.data.events.map( (event) =>
              <Swipe
                key={event!.id}
                event={event!}
                leave={async () => await deleteEvent({ id: event?.id! })}
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

const Swipe = (props: {
  event: {
    id: string,
    title: string,
    time: string,
    photo: string,
  },
  leave: () => void
}) => {
  const { event, leave } = props
  const router = useRouter()
  const { colors } = useTheme()
  const { id, title, time, photo } = event
  const image = photo ? {uri: photo} : require('../../../assets/images/placeholder.png')

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
          <Pressable onPress={onDelete}>
            <FontAwesome name="times-circle" size={60} color={colors.background} />
          </Pressable>
        </Animated.View>
      </View>
    )
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Swipeable ref={ref} renderRightActions={renderRightActions}>
        <Pressable
          key={id}
          style={[styles.row, {backgroundColor: colors.background}]}
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
  },
  switch: {
    flexDirection: 'row',
    height: xl+m,
    borderRadius: l,
    marginVertical: m,
  }
});

const MY_MATCHES = graphql(`
  query MY_MATCHES($user_id: ID!) {
    matches(user_id: $user_id) {
      id
      event {
        id
        title
        time
        photo
      }
    }
  }
`)

const MY_EVENTS = graphql(`
  query MY_EVENTS($author_id: ID!) {
    events(author_id: $author_id) {
      id
      title
      time
      photo
    }
  }
`)

const DELETE_MATCH = graphql(`
  mutation DELETE_MATCH($id: ID!) {
    deleteMatch(id: $id) {
      id
    }
  }
`)

const DELETE_EVENT = graphql(`
  mutation DELETE_EVENT($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`)