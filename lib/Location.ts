import * as Location from 'expo-location'

export const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status === 'granted') {
    const { latitude, longitude } = (await Location.getCurrentPositionAsync({})).coords
    return { latitude, longitude }
  } else {
    return null
  }
}

export type LocationType = {
  latitude: number,
  longitude: number
} | null