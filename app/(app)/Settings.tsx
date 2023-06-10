import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { openURL } from 'expo-linking';
import { useRouter, Link } from 'expo-router';

import { Button } from '../../components/Button';
import { BoldText, RegularText } from '../../components/StyledText';
import { useAuth, signOut } from '../../lib/State'
import { ExternalLink } from '../../components/ExternalLink'
import { m } from '../../constants/Spaces';

export default function Settings() {
  const router = useRouter()
  const { colors } = useTheme()
  const maxDistance = useAuth.use.maxDistance()
  const setMaxDistance = useAuth.use.setMaxDistance()

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>

        <View>
          <BoldText>Max distance to event: {maxDistance} km</BoldText>

          <Slider
            step={1}
            minimumValue={1}
            maximumValue={100}
            value={maxDistance}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={colors.card}
            maximumTrackTintColor={colors.border}
            onSlidingComplete={value => setMaxDistance(value)}
          />
        </View>

        <Button
          title={'Upgrade'}
          onPress={ () => router.push({pathname: 'Upgrade'}) }
        />
        <Button
          title={'Password'}
          onPress={ () => router.push({pathname: 'Password'}) }
        />
        <Button onPress={signOut} title={'Sign Out'}/>

        <View style={styles.row}>
          <Link href={'/Agreement'}>
            <RegularText>Agreement</RegularText>
          </Link>
          <Link href={'/Policy'}>
            <RegularText>Policy</RegularText>
          </Link>
          <RegularText onPress={() => openURL('mailto:woogie.ceo@gmail.com')}>Contact</RegularText>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: m
  },
});