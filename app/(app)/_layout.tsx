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
      <Stack.Screen name="Settings" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="Delete" />
      <Stack.Screen name="Reviews" />
      <Stack.Screen name="Review" />
      <Stack.Screen name="Chat" />
      <Stack.Screen name="User" />
      <Stack.Screen name="Event" />
      <Stack.Screen name="Report" />
      <Stack.Screen name="Password" />
      <Stack.Screen name="Agreement" />
      <Stack.Screen name="Policy" />
      <Stack.Screen name="Upgrade" options={{headerShown: false}} />
    </Stack>
  );
}