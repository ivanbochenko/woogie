import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { ImagePickerAsset } from "expo-image-picker";

export const getResizedAndCroppedPhotoUrl = async (props: {
  photo: ImagePickerAsset,
  height: number,
  width: number,
  url: string
}) => {
  const {photo, height, width, url} = props
  const croppedImg = await manipulateAsync(
    photo.uri,
    [{crop: { width: photo.width * 2/3, height: photo.height, originX: photo.width * 1/3, originY: 0 }}]
  )
  const resizedImg = await manipulateAsync(
    croppedImg.uri,
    [{ resize: { width, height } }],
    { compress: 1, format: SaveFormat.JPEG },
  )
  const response = await fetch(resizedImg.uri)
  const img = await response.blob()
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: img
  });
  return url.split('?')[0]
}

export const getResizedPhotoUrl = async (props: {
  photo: ImagePickerAsset,
  height: number,
  width: number,
  url: string
}) => {
  const {photo, height, width, url} = props
  const resizedImg = await manipulateAsync(
    photo.uri,
    [{ resize: { width, height } }],
    { compress: 1, format: SaveFormat.JPEG },
  )
  const response = await fetch(resizedImg.uri)
  const img = await response.blob()
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: img
  });
  return url.split('?')[0]
}