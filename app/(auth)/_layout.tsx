import { Stack } from 'expo-router';

export default function AuthLayoutNav() {
  return (
    <Stack initialRouteName='Intro1' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro1"/>
      <Stack.Screen name="Intro2"/>
      <Stack.Screen name="LogIn"/>
      <Stack.Screen name="register"/>
    </Stack>
  );
}