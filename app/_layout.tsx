import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato'
import { SplashScreen, Slot } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications'
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
  const colorScheme = useColorScheme();

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
        <Slot/>
      </ThemeProvider>
    </Provider>
  );
}