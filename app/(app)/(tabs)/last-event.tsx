import React, { useState, useCallback } from 'react'
import { SafeAreaView, ScrollView, View, Image, Pressable, StyleSheet, RefreshControl, ActivityIndicator, ImageBackground } from 'react-native'
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
import { LinearGradient } from 'expo-linear-gradient';

// This screen displays matches and link to event
// Chats screen displays links to chats of events matched to

const Match = (props: {
  match: any,
  onPress(): void
}) => {
  const { match, onPress } = props
  const { colors } = useTheme()
  return (
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
  )
}

export default () => {
  const { colors } = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const location = useLocation()!
  
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

  if (!data?.lastEvent) return <NewEvent latitude={location.latitude} longitude={location.longitude} refresh={refresh}/>

  const { id: event_id, title, photo, matches } = data.lastEvent
  const img = photo ? {uri: photo} : require('../../../assets/images/avatar.png')
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Pressable
          style={styles.card}
          onPress={() => router.push({pathname: 'Chat', params: { event_id, title }})}
        >
          <ImageBackground source={img} style={{height: 220, justifyContent: 'flex-end'}}>
            <LinearGradient
              colors={['black', 'transparent']}
              start={{x: 0.5, y: 1}}
              end={{x: 0.5, y: 0}}
            >
              <View style={styles.headRow}>
                <BoldText style={{ fontSize: l, color: 'white', maxWidth: 300 }}>{title}</BoldText>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        {matches?.length ? matches.map( (match: any) => (
          <Match
            key={match.id}
            match={match}
            onPress={async () => await matchUser({id: match.id})}
          />
        )) : <BoldText>No matches yet</BoldText>}
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: m,
    gap: m,
  },
  card: {
    flex: 1,
    borderRadius: l,
    overflow: 'hidden',
    // borderTopLeftRadius: 150/2 + m,
    // borderBottomLeftRadius: 150/2 + m,
    width: '100%',
  },
  img: {
    width: 180,
    height: 180,
    borderRadius: 180/2,
    marginRight: m,
  },
  match: {
    width: '100%',
    flexDirection: "row",
    justifyContent: 'space-around',
    padding: m,
    borderRadius: l,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  headRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s*3,
    minHeight: xl*2,
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