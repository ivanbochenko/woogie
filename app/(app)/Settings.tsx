import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { openURL } from 'expo-linking';

import { View } from '../../components/Themed';
import { Button } from '../../components/Button';
import { BoldText } from '../../components/StyledText';
import { useAuth } from '../../lib/Auth'
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter()
  const { colors } = useTheme()
  const { signOut, maxDistance, setMaxDistance } = useAuth()

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    }}>

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

      <Button title={'Feedback'} onPress={() => openURL('mailto:woogie.ceo@gmail.com')}/>

      <Button onPress={signOut} title={'Sign Out'}/>
      
      <Button
        title={'Upgrade'}
        onPress={
          () => {
            // router.push({pathname: 'Upgrade'})
          }
        }
      />

    </View>
  );
}