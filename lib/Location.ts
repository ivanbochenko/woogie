import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

export const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status === 'granted') {
    const { latitude, longitude } = (await Location.getCurrentPositionAsync({})).coords
    return { latitude, longitude }
  } else {
    return null
  }
}

export const useLocation = () => {
  const [location, setLocation] = useState({} as LocationType)
  useEffect(() => {
    (async () => {
      const freshLocation = await getLocation()
      setLocation(freshLocation)
    })()
  }, [])
  return location
}

type LocationType = {
  latitude: number,
  longitude: number
} | null