import React, { useState, useCallback } from 'react'
import { SafeAreaView, ScrollView, View, Image, Pressable, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { useQuery, useMutation,  } from 'urql';
import Animated, {
  Layout,
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";

import { Square } from '../../../components/Button';
import { RegularText, BoldText } from '../../../components/StyledText';
import { Icon } from '../../../components/Themed';
import { s, m, l, xl } from '../../../constants/Spaces';
import { useAuth } from '../../../lib/Auth';
import { useRouter } from 'expo-router';
import User from "../../../components/User";
import NewEvent from '../new-event'
import { graphql } from '../../../gql';
import { useLocation } from '../../../lib/Location';
import { baseURL } from '../../../lib/Client';

// This screen displays matches and link to event
// Chats screen displays links to chats of events matched to

const Match = (props: {
  match: any,
  onPress(): void
}) => {
  const { match, onPress } = props
  const { colors } = useTheme()
  return (
    <>
      <Animated.View
        entering={FadeInLeft}
        exiting={FadeOutRight}
        layout={Layout.springify()}
        style={[styles.match, {backgroundColor: colors.border}]}
      >
        <User {...match.user}/>
        <Pressable style={{alignItems: 'center'}} onPress={onPress}>
          <View style={[styles.circle, {backgroundColor: colors.card}]}>
            <Icon name="check" />
          </View>
          <RegularText>Accept</RegularText>
        </Pressable>
      </Animated.View>
    </>
  )
}

export default () => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const location = useLocation()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const refresh = () => reexecuteQuery({requestPolicy: 'network-only'})

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refresh()
    setRefreshing(false)
  }, []);

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: LAST_EVENT,
    variables: { author_id: user?.id! },
  });
  
  const [matchUserResult, matchUser] = useMutation(ACCEPT_MATCH)
  
  if (fetching) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={'gray'} />
    </View>
  )

  if (!data?.lastEvent) return <NewEvent latitude={location?.latitude!} longitude={location?.longitude!} refresh={refresh}/>

  const { id: event_id, title, photo, matches } = data.lastEvent
  const img = photo ? {uri: photo} : require('../../../assets/images/avatar.png')
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Pressable
          style={[styles.card, {backgroundColor: colors.card}]}
          onPress={() => router.push({pathname: 'Chat', params: { event_id, title }})}
        >
          <Image style={styles.img} source={img} />
          <View style={{flex: 1}}>
            <BoldText>{title}</BoldText>
          </View>
        </Pressable>
        {matches?.length ? matches.map( (match: any) => (
          <Match
            key={match.id}
            match={match}
            onPress={async () => await matchUser({id: match.id})}
          />
        )) : <BoldText style={{margin: m}}>No matches yet</BoldText>}
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: m
  },
  card: {
    flex: 1,
    padding: m,
    borderRadius: l,
    borderTopLeftRadius: 150/2 + m,
    width: '100%',
    flexDirection: "row",
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    marginRight: m,
  },
  match: {
    width: '100%',
    flexDirection: "row",
    justifyContent: 'space-around',
    padding: m,
    marginTop: m,
    borderRadius: l,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LAST_EVENT = graphql(`
  query LAST_EVENT($author_id: ID!) {
    lastEvent(author_id: $author_id) {
      id
      title
      photo
      matches {
        id
        accepted
        user {
          id
          avatar
          name
        }
      }
    }
  }
`)

const ACCEPT_MATCH = graphql(`
  mutation ACCEPT_MATCH($id: ID!) {
    acceptMatch(id: $id) {
      id
    }
  }
`)