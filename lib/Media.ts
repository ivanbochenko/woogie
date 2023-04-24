import { useEffect } from 'react'
import * as ImagePicker from "expo-image-picker";

export const useMediaPermissions = () => {
  useEffect(() => {
    (async () => {  
      await ImagePicker.requestCameraPermissionsAsync()
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    })()
  }, [])
}

export const getMediaPermissions = async () => {
  await ImagePicker.requestCameraPermissionsAsync()
  await ImagePicker.requestMediaLibraryPermissionsAsync()
}