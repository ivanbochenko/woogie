import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation } from 'urql';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/Auth'
import { graphql } from '../../../gql';
import { useLocation } from '../../../lib/Location';

export default () => {
  const { api, user, maxDistance } = useAuth()
  const [events, setEvents] = useState(null)
  const [matchResult, match] = useMutation(CREATE_MATCH)
  const location = useLocation()
  const user_id = user?.id!

  // Get location and fetch close events
  useEffect(() => {
    (async () => {
      if (user_id && location && maxDistance) {
        const { status, data } = await api.post(`feed`, {user_id, location, maxDistance})
        if (status == 200) setEvents(data)
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