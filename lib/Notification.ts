import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef } from 'react'

export const registerNotifications = async () => {

  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications')
    return
  }

  const { status } = await Notifications.getPermissionsAsync()

  if (status !== 'granted') {
    const requestedStatus = (await Notifications.requestPermissionsAsync()).status
    if (requestedStatus !== 'granted') {
      throw new Error('Permission for notifications not granted!')
    }
  }

  const { data } = await Notifications.getExpoPushTokenAsync()
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return data
}

export const useNotifications = (onRecieved: ({})=>void, onResponse: ({})=>void) => {
  
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()
  
  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => onRecieved(notification))
    // This listener is fired whenever a user taps on or interacts with a notification
    // works when app is foregrounded, backgrounded, or killed
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => onResponse(response))

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!)
      Notifications.removeNotificationSubscription(responseListener.current!)
    }
  }, [])
}