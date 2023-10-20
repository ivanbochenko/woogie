import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato'
import { SplashScreen, Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications'
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MyDarkTheme, MyLightTheme } from '../constants/Colors'
import { hydrateAuth, useAuth } from '../lib/State';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)'
};

SplashScreen.preventAutoHideAsync()

hydrateAuth()

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  return loaded ? <RootLayoutNav/> : null
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const token = useAuth.use.token()
  useAuth.use.getLocation()()
  
  useAuth.use.getProAccess()()
  useAuth.use.hydrateSwipes()()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <Stack
        initialRouteName='index'
        screenOptions={{
          presentation: 'modal',
          headerStyle: { 
            backgroundColor: colorScheme === 'dark' ? MyDarkTheme.colors.background : MyLightTheme.colors.background
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, presentation: 'card' }} redirect={!token} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} redirect={!!token} />
        <Stack.Screen name="Settings" redirect={!token} />
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
    </ThemeProvider>
  );
}