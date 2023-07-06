import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato'
import { SplashScreen, Slot } from 'expo-router';
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider } from '../lib/Auth'
import { MyDarkTheme, MyLightTheme } from '../constants/Colors'
import { hydrateAuth } from '../lib/State';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)'
};

SplashScreen.preventAutoHideAsync()

hydrateAuth()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [loaded, error] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync()
  }, [error, loaded]);

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
        <Slot/>
      </ThemeProvider>
    </Provider>
  )
}