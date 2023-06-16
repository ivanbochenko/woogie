import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation, useQuery } from 'urql';
import { useRouter } from 'expo-router';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/State'
import { NUMBER_OF_FREE_SWIPES } from '../../../constants/Config'
import { CREATE_MATCH, FEED_QUERY } from '../../../gql/queries';

export default () => {
  const router = useRouter()
  const swipes = useAuth.use.swipes()
  const proAccess = useAuth.use.pro()
  const addSwipe = useAuth.use.addSwipe()
  const user_id = useAuth.use.id()!
  const maxDistance = useAuth.use.maxDistance()
  const location = useAuth.use.location()
  const [matchResult, match] = useMutation(CREATE_MATCH)

  const [{ data, fetching, error }, refreshEvents] = useQuery({
    query: FEED_QUERY,
    variables: {
      user_id,
      maxDistance,
      latitude: location?.latitude!,
      longitude: location?.longitude!
    },
    pause: !location || !maxDistance || !user_id
  })

  const onSwipe = async (event_id: string, dismissed: boolean) => {
    if (proAccess) {
      await match({user_id, event_id, dismissed})
      return
    }
    if (swipes >= NUMBER_OF_FREE_SWIPES) {
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
    zIndex: -10,
    position: 'absolute',
  }
});
