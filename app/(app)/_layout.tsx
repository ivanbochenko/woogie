import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function RootLayoutNav() {
  const { colors } = useTheme()

  return (
    <Stack
      initialRouteName='index'
      screenOptions={{
        presentation: 'modal',
        headerStyle: { 
          backgroundColor: colors.background
        },
      }}
    >
      <Stack.Screen name="(tabs)"  options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="(profile)" options={{ headerTitle: 'Profile' }} />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="Reviews" />
      <Stack.Screen name="Review" />
      <Stack.Screen name="Chat" />
      <Stack.Screen name="User" />
      <Stack.Screen name="Event" />
      {/* <Stack.Screen name="Upgrade" /> */}
    </Stack>
  );
}