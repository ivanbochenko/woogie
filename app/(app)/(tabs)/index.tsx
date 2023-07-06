import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation, useQuery } from 'urql';
import { useRouter } from 'expo-router';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/State'
import { CREATE_MATCH, FEED_QUERY } from '../../../lib/queries';

const freeSwipes = 5

export default () => {
  const router = useRouter()
  const swipes = useAuth.use.swipes()
  const proAccess = useAuth.use.pro()
  const addSwipe = useAuth.use.addSwipe()
  const user_id = useAuth.use.id()!
  const maxDistance = useAuth.use.maxDistance()
  const location = useAuth.use.location()

  const [{ data, fetching, error }] = useQuery({
    query: FEED_QUERY,
    variables: {
      user_id,
      maxDistance,
      latitude: location?.latitude!,
      longitude: location?.longitude!
    },
    pause: !location || !maxDistance || !user_id
  })
  
  const [_, match] = useMutation(CREATE_MATCH)

  const onSwipe = async (event_id: string, dismissed: boolean) => {
    if (proAccess) {
      return await match({user_id, event_id, dismissed})
    }
    if (swipes >= freeSwipes) {
      return router.push({pathname: 'Upgrade'})
    }
    if (!dismissed) {
      await addSwipe()
    }
    await match({user_id, event_id, dismissed})
  }

  if (fetching || typeof data === 'undefined') return <Fade/>

  if (error) return (
    <SafeAreaView style={styles.container}>
      <RegularText>Server error</RegularText>
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.container}>
      <RegularText style={styles.deepText}>
        Thats all events in your area, make sure your location is on.
      </RegularText>
      {!!data?.feed?.length ? <Stack events={data.feed} onSwipe={onSwipe}/> : null}
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
    width: 300,
    zIndex: -10,
    position: 'absolute',
  }
});
