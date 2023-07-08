import * as ImagePicker from "expo-image-picker";

const options = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
}

export const launchImagePicker = async (pickFromCamera: boolean) => {
  let result
  if (pickFromCamera) {
    await ImagePicker.requestCameraPermissionsAsync()
    result = await ImagePicker.launchCameraAsync(options)
  } else {
    await ImagePicker.requestMediaLibraryPermissionsAsync()
    result = await ImagePicker.launchImageLibraryAsync(options)
  }
  return result.canceled ? null : result.assets[0]
}