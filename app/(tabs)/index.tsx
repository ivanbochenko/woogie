import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Fade } from "@/components/Fade";
import { Stack } from '@/components/Card';
import { RegularText } from '@/components/StyledText';
import { useAuth } from '@/lib/State'

const freeSwipes = 5

export default () => {
  const router = useRouter()
  const swipes = useAuth.use.swipes()
  const app = useAuth.use.app()()
  const proAccess = useAuth.use.pro()
  const addSwipe = useAuth.use.addSwipe()
  const id = useAuth.use.id()!
  const max_distance = useAuth.use.maxDistance()
  const location = useAuth.use.location()
  const [fetching, setFetching] = useState(false)
  const [respose, setRespose] = useState<Awaited<ReturnType<typeof app.feed.post>>>()

  useEffect(() => {
    (async () => {
      if (location) {
        setFetching(true)
        const { latitude, longitude } = location
        const res = await app.feed.post({
          id,
          max_distance,
          latitude,
          longitude
        })
        setRespose(res)
        setFetching(false)
      }
    })()
  }, [location, max_distance])
  

  if (fetching || respose?.error || !respose?.data ) return (
    <SafeAreaView style={styles.container}>
      {fetching
        ? <Fade/>
        : <RegularText>Server error</RegularText>
      }
    </SafeAreaView>
  )

  const onSwipe = async (event_id: string, dismissed: boolean) => {
    if (proAccess) {
      return await app.match.create.post({user_id: id, event_id, dismissed})
    }
    if (swipes >= freeSwipes) {
      return router.push({pathname: 'Upgrade'})
    }
    if (!dismissed) {
      await addSwipe()
    }
    await app.match.create.post({user_id: id, event_id, dismissed})
  }

  return (
    <SafeAreaView style={styles.container}>
      <RegularText style={styles.deepText}>
        Thats all events in your area, make sure your location is on.
      </RegularText>
      {!!respose.data?.length ? <Stack events={respose.data} onSwipe={onSwipe}/> : null}
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
