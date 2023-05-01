import React from 'react'
import { s, m, l, xl } from '../constants/Spaces';
import { Icon } from '../components/Themed'
import MapView, { Marker } from 'react-native-maps';
import { openURL } from 'expo-linking';

export default function Map(props:{
  latitude: number,
  longitude: number,
  height: number
}) {
  const { latitude, longitude, height } = props
  return (
    <MapView
      onPress={() => openURL(`http://maps.apple.com/?daddr=${latitude},${longitude}`)}
      style={{
        borderRadius: l,
        width: '100%',
        height,
      }}
      scrollEnabled={false}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={{ latitude, longitude }} >
        <Icon name="map-pin" />
      </Marker>
    </MapView>
  )
}
