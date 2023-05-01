import React, { useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import MapView from 'react-native-maps';
import { useMutation } from 'urql'
import DateTimePicker from '@react-native-community/datetimepicker';

import { s, m, l, xl } from '../../constants/Spaces';
import { getResizedAndCroppedPhotoUrl } from '../../lib/getPhotoUrl'
import { Button, Square } from '../../components/Button';
import BottomSheet from '@gorhom/bottom-sheet';
import { Icon } from '../../components/Themed';
import { BoldText, RegularText, TextInput } from '../../components/StyledText'
import { useAuth } from '../../lib/Auth';
import { graphql } from '../../gql';
import { getMediaPermissions } from '../../lib/Media';
import { getDistance } from '../../lib/Distance';

const CREATE_EVENT = graphql(`
  mutation CREATE_EVENT($author_id: ID!, $title: String!, $text: String!, $photo: String!, $slots: Int!, $time: DateTime!, $latitude: Float!, $longitude: Float!) {
    postEvent(author_id: $author_id, title: $title, text: $text, photo: $photo, slots: $slots, time: $time, latitude: $latitude, longitude: $longitude) {
      id
    }
  }
`)

const MAX_SLOTS = 20

type Sheet = 'map' | 'time' | 'photo'

export default (props: {
  refresh(): void,
  latitude: number,
  longitude: number
}) => {
  const {refresh, latitude, longitude} = props
  const { colors } = useTheme()
  const combinedInputStyles = [ styles.input, {backgroundColor: colors.border} ]
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [showSheet, setShowSheet] = useState<Sheet>('photo')
  
  const snapPoints = useMemo(() => ['75%'], [])
  
  const { api, user } = useAuth()

  const initialState = {
    author_id: user?.id!,
    photo: {} as ImagePicker.ImagePickerAsset,
    title: '',
    text: '',
    time: new Date(),
    slots: 1,
    latitude,
    longitude,
  }

  const [state, setState] = useState(initialState)

  const [postEventResult, postEvent] = useMutation(CREATE_EVENT)

  const onSubmit = async () => {
    if (state.photo && state.title && state.text) {
      const photo = await getResizedAndCroppedPhotoUrl({
        photo: state.photo, 
        width: 576,
        height: 864,
        url: (await api.get(`s3url`)).data
      })
      const result = await postEvent({...state, photo})
      if (result.error) console.error('Oh no!', result.error)
      refresh()
    } else {
      Alert.alert('Pick photo, title and text')
      return
    }
  }

  const launchPicker = async (pickFromCamera: boolean) => {
    getMediaPermissions();
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    }
    const result = pickFromCamera
      ? (await ImagePicker.launchCameraAsync(options))
      : (await ImagePicker.launchImageLibraryAsync(options))

    bottomSheetRef.current?.close()
    if (!result.canceled) {
      const photo = result.assets[0]
      setState(state => ({...state, photo}))
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          padding: m
        }}
      >

        {/* Add photo */}
        <View style={[styles.heading, {marginBottom: s}]}>
          <BoldText>Picture</BoldText>
          <RegularText style={styles.text}>Select the best picture for your event</RegularText>
        </View>
        <Pressable
          style={[styles.addImg, {backgroundColor: colors.border}]}
          onPress={() => {
            setShowSheet('photo')
            bottomSheetRef.current?.expand()
          }}
        >
          {state.photo.uri
            ? <Image style={styles.addImg} source={state.photo}/>
            : <Icon name="camera" size={xl}/>
          }
        </Pressable>

        {/* Title and text */}
        <View style={styles.heading}>
          <BoldText>Title & Text</BoldText>
          <RegularText style={styles.text}>Write fun and clear intro</RegularText>
        </View>
        <TextInput
          maxLength={50}
          placeholder={'Title...'}
          onChangeText={ title => setState(state => ({...state, title}))}
          value={state.title}
        />
        <TextInput
          multiline
          numberOfLines={3}
          maxLength={300}
          placeholder={'Text...'}
          onChangeText={ text => setState(state => ({...state, text}))}
          value={state.text}
        />

        {/* Pick time */}
        <View style={styles.heading}>
          <BoldText>Time & Location</BoldText>
          <RegularText style={styles.text}>When and where event starts</RegularText>
        </View>
        <Pressable
          style={combinedInputStyles}
          onPress={() => {
            setShowSheet('time')
            bottomSheetRef.current?.expand()
          }}
        >
          <Icon name="clock-o"/>
          <BoldText>{state.time.toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")}</BoldText>
          <View style={{width: l}}/>
        </Pressable>

        {/* Set location */}
        <Pressable
          style={combinedInputStyles}
          onPress={() => {
            setShowSheet('map')
            bottomSheetRef.current?.expand()
          }}
        >
          <Icon style={{paddingLeft: s}} name="map-pin" />
          <BoldText>Location: {getDistance(latitude, longitude, state.latitude, state.longitude)} km</BoldText>
          <View style={{width: l}}/>
        </Pressable>

        {/* Set slots */}
        <View style={styles.heading}>
          <BoldText>Slots</BoldText>
          <RegularText style={styles.text}>How many people you expect</RegularText>
        </View>
        <View style={[combinedInputStyles, { alignItems: 'center' }]}>
          <Pressable
            onPress={() => {
              if (state.slots > 1) setState(state => ({...state, slots: --state.slots}))
            }}
            style={[styles.add, {backgroundColor: colors.background}]}
          >
            <Icon name="minus"/>
          </Pressable>
          <BoldText>{state.slots}</BoldText>
          <Pressable
            onPress={() => {
              if (state.slots < MAX_SLOTS) setState(state => ({...state, slots: ++state.slots}))
            }}
            style={[styles.add, {backgroundColor: colors.background}]}
          >
            <Icon name="plus"/>
          </Pressable>
        </View>

        <Button title={'Create'} onPress={onSubmit}/>
      </ScrollView>

      <BottomSheet
        backgroundStyle={[styles.container, {backgroundColor: colors.border}]}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
      >
        {
          ({
            time:
              <DateTimePicker
                testID="dateTimePicker"
                mode='time'
                display='spinner'
                value={state.time}
                onChange={(event, time) => setState(state => ({...state, time: time ?? new Date()}))}
              />,

            map:
              <>
                <MapView
                  style={{flex: 1}}
                  initialRegion={{
                    latitude: state.latitude,
                    longitude: state.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onRegionChangeComplete={(region) => {
                    const { latitude, longitude } = region
                    setState(state => ({ ...state, latitude, longitude }))
                  }}
                />
                <Icon
                  name="map-pin"
                  style={styles.marker}
                />
              </>,

            photo:
              <View style={[styles.container, styles.row, {justifyContent: 'space-evenly'}]}>
                <Square
                  onPress={async () => await launchPicker(true)}
                  icon={<Icon name="camera" size={xl}/>}
                />
                <Square
                  onPress={async () => await launchPicker(false)}
                  icon={<Icon name="photo" size={xl}/>}
                />
              </View>
          })[showSheet]
        }
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    color: 'gray',
    marginTop: s,
  },
  heading: {
    marginTop: m,
    width: '100%'
  },
  addImg: {
    width: '100%',
    height: m*10,
    borderRadius: l,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    justifyContent: 'space-between',
    width: '100%',
    padding: m,
    borderRadius: l,
    marginTop: m,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  add: {
    width: xl,
    height: xl,
    borderRadius: l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  marker: {
    left: '50%',
    marginLeft: -m,
    marginTop: -m,
    position: 'absolute',
    top: '50%'
  }
});
