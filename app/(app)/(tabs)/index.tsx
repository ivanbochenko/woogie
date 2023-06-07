import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation, useQuery } from 'urql';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/State'
import { graphql } from '../../../gql';

export default () => {
  const id = useAuth.use.id()
  const incSwipes = useAuth.use.incSwipes()
  const maxDistance = useAuth.use.maxDistance()
  const location = useAuth.use.location()
  const user_id = id!
  const [matchResult, match] = useMutation(CREATE_MATCH)

  const onSwipe = async (event_id: string, dismissed: boolean) => {
    await match({user_id, event_id, dismissed})
    if (!dismissed) {
      await incSwipes()
    }
  }

  if (!location) {
    <SafeAreaView style={styles.container}>
      <RegularText>We need your location to show events near you</RegularText>
    </SafeAreaView>
  }

  const [{ data, fetching, error }, refreshEvents] = useQuery({
    query: FEED_QUERY,
    variables: {
      user_id,
      maxDistance,
      latitude: location?.latitude!,
      longitude: location?.longitude!
    },
  })

  if (fetching || !data?.feed) return <Fade/>

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