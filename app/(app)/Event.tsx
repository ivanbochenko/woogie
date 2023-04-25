import React from 'react'
import { View, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView, FlatList, ImageBackground } from 'react-native'
import { useQuery } from 'urql'
import { useSearchParams } from 'expo-router';
import { useIsFocused, useTheme } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { s, m, l, xl } from '../../constants/Spaces';
import { height, width } from '../../constants/Layout';
import { RegularText, BoldText } from '../../components/StyledText'
import { Icon } from '../../components/Themed'
import User from '../../components/User'
import { graphql } from '../../gql';

export default () => {
  const isFocused = useIsFocused()
  const { colors } = useTheme()
  const { event_id } = useSearchParams() as {event_id: string}

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: eventQuery,
    variables: { id: event_id },
    pause: !isFocused
  })
  
  if (fetching) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={'gray'} />
    </View>
  )

  if (error) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <RegularText>
        Server error
      </RegularText>
    </View>
  )

  const { title, text, time, photo, author, matches, latitude, longitude } = data?.event!
  const users = matches?.map(item => item?.user)
  const image = photo ? {uri: photo} : require('../../assets/images/placeholder.png')

  return (
    <View style={styles.container}>
      <SafeAreaView style={{backgroundColor: colors.card, borderRadius: l, overflow: 'hidden', width: width-m, height: height-120-l}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          bounces={false}
        >
          <ImageBackground source={image} style={{height: height-120-l, justifyContent: 'flex-end'}}>
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent']}
              start={{x: 0.5, y: 1}}
              end={{x: 0.5, y: 0}}
            >
              <View style={styles.headRow}>
                <BoldText style={{ fontSize: l, color: 'white', maxWidth: width-xl*3 }}>{title}</BoldText>
              </View>
            </LinearGradient>
          </ImageBackground>

          <View style={{paddingHorizontal: s*3}}>
            <View style={{paddingTop: s*3}}/>
            <BoldText>{new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")}</BoldText>
            <View style={{paddingTop: s*3}}/>
            <RegularText>{text}</RegularText>
            <View style={{paddingTop: s*3}}/>
            <FlatList
              showsHorizontalScrollIndicator={false}
              overScrollMode={'never'}
              horizontal={true}
              data={[author, ...users!]}
              renderItem={({item}) => <User {...item!}/>}
            />
            <View style={{paddingTop: s*3}}/>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              initialRegion={{
                latitude: latitude!,
                longitude: longitude!,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude: latitude!, longitude: longitude! }} >
                <Icon name="map-pin" />
              </Marker>
            </MapView>
            <View style={{paddingTop: s*3}}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'flex-end',
  },
  headRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s*3,
    minHeight: xl*2,
  },
  distance: {
    borderRadius: l,
    padding: m,
  },
  map: {
    borderRadius: l,
    width: '100%',
    height: 200,
  },
});

const eventQuery = graphql(`
  query event_query($id: ID!) {
    event(id: $id) {
      id
      author {
        id
        name
        avatar
      }
      author_id
      title
      text
      time
      slots
      photo
      latitude
      longitude
      matches {
        id
        accepted
        user {
          id
          avatar
          name
        }
      }
    }
  }
`)