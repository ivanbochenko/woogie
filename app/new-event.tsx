import React, { useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MapView from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

import { s, m, l, xl } from '@/constants/Spaces';
import { Button, Square } from '@/components/Button';
import BottomSheet from '@gorhom/bottom-sheet';
import { Icon } from '@/components/Themed';
import { BoldText, RegularText, TextInput } from '@/components/StyledText'
import { useAuth } from '@/lib/State';
import { launchImagePicker } from '@/lib/Media';
import { dateShiftHours, getDistance } from '@/lib/Calc';
import { useRouter } from 'expo-router';

const MAX_SLOTS = 20

type Sheet = 'photo' | 'time' | 'map'

export default (props: {
  latitude: number,
  longitude: number
}) => {
  const {latitude, longitude} = props
  const { colors } = useTheme()
  const router = useRouter()
  const combinedInputStyles = [ styles.input, {backgroundColor: colors.border} ]

  const [showSheet, setShowSheet] = useState<Sheet>('photo')
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], [])
  
  const id = useAuth.use.id()
  const app = useAuth.use.app()()

  const initialState = {
    author_id: id!,
    photo: '',
    title: '',
    text: '',
    time: new Date(),
    slots: 5,
    latitude,
    longitude,
  }

  const [state, setState] = useState(initialState)

  const getPhoto = async (camera: boolean) => {
    const image = await launchImagePicker(camera)
    bottomSheetRef.current?.close()
    if (image) {
      const croppedImg = await manipulateAsync(
        image.uri,
        [{crop: { width: image.width * 2/3, height: image.height, originX: image.width * 1/3, originY: 0 }}]
      )
      const resizedImg = await manipulateAsync(
        croppedImg.uri,
        [{ resize: { width: 576, height: 864 } }],
        { compress: 1, format: SaveFormat.JPEG },
      )
      const photo = resizedImg.uri
      setState(state => ({...state, photo}))
    }
  }

  const onSubmit = async () => {
    if (!state.photo || !state.title || !state.text) {
      return Alert.alert('Pick photo, title and text')
    }
    if (state.time <= dateShiftHours(new Date(), -0.5)) {
      setState(state => ({...state, time: dateShiftHours(state.time, 24)}))
    }
    const file = { uri: state.photo, type: 'image/jpeg', name: 'photo.jpg' } as unknown as File
    const { data, error } = await app.photo[id!].post({ file })
    if (!data) {
      return Alert.alert('Explicit image')
    }
    const res = await app.event.create.post({...state, photo: data})
    router.back()
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
          style={[styles.addImg, {backgroundColor: colors.border, marginTop: s}]}
          onPress={() => {
            setShowSheet('photo')
            bottomSheetRef.current?.expand()
          }}
        >
          {state.photo
            ? <Image style={styles.addImg} source={{uri: state.photo}}/>
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
            photo:
              <View style={styles.container}>
                <View style={[styles.row, { width: '100%', justifyContent: 'space-evenly'}]}>
                  <Square
                    onPress={async () => await getPhoto(true)}
                    icon={<Icon name="camera" size={xl}/>}
                  />
                  <Square
                    onPress={async () => await getPhoto(false)}
                    icon={<Icon name="photo" size={xl}/>}
                  />
                </View>
              </View>,
            time:
              <View style={styles.container}>
                <DateTimePicker
                  testID="dateTimePicker"
                  mode='time'
                  display='spinner'
                  value={state.time}
                  onChange={(event, time = new Date()) => setState(state => ({...state, time})
                  )}
                />
                <Button title='Ok' onPress={() => bottomSheetRef.current?.close()}/>
              </View>,

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
                <View style={styles.ok}>
                  <Button title='Ok' onPress={() => bottomSheetRef.current?.close()}/>
                </View>
              </>
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
  },
  ok: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: '0%',
    marginBottom: m
  }
});