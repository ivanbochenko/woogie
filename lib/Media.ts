import * as ImagePicker from "expo-image-picker";

export const launchImagePicker = async (pickFromCamera: boolean) => {
  let result
  if (pickFromCamera) {
    await ImagePicker.requestCameraPermissionsAsync();
    result = await ImagePicker.launchCameraAsync(options)
  } else {
    await ImagePicker.requestMediaLibraryPermissionsAsync()
    result = await ImagePicker.launchImageLibraryAsync(options)
  }
  if (result.canceled) {
    return null
  } else {
    const photo = result.assets[0]
    return photo
  }
}

const options = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
}