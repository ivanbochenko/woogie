import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation, useQuery } from 'urql';
import { useRouter } from 'expo-router';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/State'
import { graphql } from '../../../gql';

const NUMBER_OF_FREE_SWIPES = 5

export default () => {
  const router = useRouter()
  const id = useAuth.use.id()
  const swipes = useAuth.use.swipes()
  const proAccess = useAuth.use.pro()
  const addSwipe = useAuth.use.addSwipe()
  const maxDistance = useAuth.use.maxDistance()
  const location = useAuth.use.location()
  const user_id = id!
  const [matchResult, match] = useMutation(CREATE_MATCH)

  const [{ data, fetching, error }, refreshEvents] = useQuery({
    query: FEED_QUERY,
    variables: {
      user_id,
      maxDistance,
      latitude: location?.latitude!,
      longitude: location?.longitude!
    },
  })

  const onSwipe = async (event_id: string, dismissed: boolean) => {
    if (swipes > NUMBER_OF_FREE_SWIPES) {
      return router.push({pathname: 'Upgrade'})
    }
    if (!dismissed && !proAccess) await addSwipe()
    await match({user_id, event_id, dismissed})
  }

  if (fetching || !data?.feed) {
    return <Fade/>
  } else if (!location) return (
    <SafeAreaView style={styles.container}>
      <RegularText>We need your location to show events near you</RegularText>
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Stack events={data?.feed} onSwipe={onSwipe} />
      <RegularText style={styles.deepText}>Thats all events in your area</RegularText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deepText: {
    zIndex: -2,
    position: 'absolute',
  }
});

const CREATE_MATCH = graphql(`
  mutation CREATE_MATCH($dismissed: Boolean!, $event_id: String!, $user_id: String!) {
    createMatch(dismissed: $dismissed, event_id: $event_id, user_id: $user_id) {
      id
    }
  }
`)

const FEED_QUERY = graphql(`
  query FEED($user_id: String!, $maxDistance: Int!, $latitude: Float!, $longitude: Float!) {
    feed(user_id: $user_id, maxDistance: $maxDistance, latitude: $latitude, longitude: $longitude) {
      id
      author_id
      title
      text
      time
      photo
      slots
      latitude
      longitude
      distance
      author {
        id
        name
        avatar
      }
      matches {
        user {
          id
          name
          avatar
        }
      }
    }
  }
`)