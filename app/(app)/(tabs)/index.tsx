import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation } from 'urql';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/Auth'
import { graphql } from '../../../gql';

export default () => {
  const { api, user, maxDistance, location } = useAuth()
  const user_id = user?.id!
  const [events, setEvents] = useState(null)
  const [matchResult, match] = useMutation(CREATE_MATCH)
  
  useEffect(() => {
    (async () => {
      if (user_id && location && maxDistance) {
        const { status, data } = await api.post('graphql', {
          query: FEED_QUERY,
          variables: {
            user_id,
            maxDistance,
            latitude: location.latitude,
            longitude: location.longitude,
          }
        })
        if (status == 200) setEvents(data.data.feed)
      }
    })()
  }, [user, maxDistance, location])

  const onSwipeRight = async (event_id: string) => {
    await match({user_id, event_id, dismissed: false})
  }

  const onSwipeLeft = async (event_id: string) => {
    await match({user_id, event_id, dismissed: true})
  }

  if (!events) return <Fade/>

  return (
    <SafeAreaView style={styles.container}>
      <Stack
        events={events}
        onSwipeRight={onSwipeRight}
        onSwipeLeft={onSwipeLeft}
      >
        <RegularText>Thats all events in your area</RegularText>
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CREATE_MATCH = graphql(`
  mutation CREATE_MATCH($dismissed: Boolean!, $event_id: ID!, $user_id: ID!) {
    createMatch(dismissed: $dismissed, event_id: $event_id, user_id: $user_id) {
      id
    }
  }
`)

const FEED_QUERY = `
  query ($user_id: ID!, $maxDistance: Int!, $latitude: Float!, $longitude: Float!) {
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
`