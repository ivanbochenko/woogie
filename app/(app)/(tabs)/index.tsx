import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation } from 'urql';
import { useRouter } from 'expo-router';
import { Fade } from "../../../components/Fade";
import { Stack } from '../../../components/Card';
import { RegularText } from '../../../components/StyledText';
import { useAuth } from '../../../lib/State'
import { NUMBER_OF_FREE_SWIPES } from '../../../constants/Config'
import { CREATE_MATCH } from '../../../gql/queries';

export default () => {
  const router = useRouter()
  const swipes = useAuth.use.swipes()
  const proAccess = useAuth.use.pro()
  const addSwipe = useAuth.use.addSwipe()
  const user_id = useAuth.use.id()!
  const { data, fetching } = useAuth.use.feed()
  const [matchResult, match] = useMutation(CREATE_MATCH)

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

  if (typeof data === 'undefined' || fetching) return <Fade/>

  return (
    <SafeAreaView style={styles.container}>
      {!!data?.length ? <Stack events={data} onSwipe={onSwipe}/> : null}
      <RegularText style={styles.deepText}>
        Thats all events in your area, make sure your location is on.
      </RegularText>
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
