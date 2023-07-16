import React, { useRef, useMemo } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Image, View, Pressable } from 'react-native';
import { Button, Square } from "./Button";
import { Icon } from './Themed';
import BottomSheet from '@gorhom/bottom-sheet';
import { s, m, l, xl } from '../constants/Spaces';
import { RegularText, TextInput } from './StyledText';
import { useTheme } from '@react-navigation/native';
import { launchImagePicker } from '../lib/Media';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { AVATAR } from '@/constants/images';

export type UserData = {
  id: string,
  name: string | null,
  avatar: string | null,
  age: string | null,
  bio: string | null,
  sex: string | null,
}

export const EditProfileView = ({value, setValue, onSubmit}: {
  value: UserData,
  setValue: React.Dispatch<React.SetStateAction<UserData>>,
  onSubmit(): Promise<void>
}) => {
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%'], [])
  const img = value.avatar ? {uri: value.avatar} : AVATAR

  const getPhoto = async (camera:boolean) => {
    const photo = await launchImagePicker(camera)
    bottomSheetRef.current?.close()
    if (photo) {
      const resizedImg = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 240, height: 240 } }],
        { compress: 1, format: SaveFormat.JPEG },
      )
      const avatar = resizedImg.uri
      setValue(value => ({...value, avatar}))
    }
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.center}>
        <Pressable style={{borderRadius: 90}} onPress={() => bottomSheetRef.current?.expand()}>
          <Image style={styles.profileImg} source={img} />
        </Pressable>
        <TextInput
          maxLength={50}
          placeholder={'Name...'}
          onChangeText={ name => setValue(value => ({...value, name}))}
          value={value.name ?? ''}
        />
        <TextInput
          keyboardType='numeric'
          maxLength={2}
          placeholder={'Age...'}
          onChangeText={ age => setValue(value => ({...value, age}))}
          value={value.age ?? ''}
        />
        <Pressable
          style={[styles.input, {backgroundColor: colors.border}]}
          onPress={() => setValue( value => ({...value, sex: value.sex === 'Man' ? 'Woman' : 'Man'}))}
        >
          <RegularText>{value.sex ?? 'Sex'}</RegularText>
        </Pressable>
        <TextInput
          multiline
          maxLength={500}
          placeholder={'Bio...'}
          onChangeText={ bio => setValue(value => ({...value, bio}))}
          value={value.bio ?? ''}
        />

        <Button title={'Save'} onPress={onSubmit}/>
      </ScrollView>

      {/* Photo bottomsheet */}
      <BottomSheet
        backgroundStyle={{backgroundColor: colors.border}}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
      >
        <View style={[styles.center, styles.row, {justifyContent: 'space-evenly'}]}>
          <Square
            onPress={async () => getPhoto(true)}
            icon={<Icon name="camera" size={xl} />}
          />
          <Square
            onPress={async () => getPhoto(false)}
            icon={<Icon name="image" size={xl}/>}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: m,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    width: '100%',
    justifyContent: "center",
    marginTop: m,
    borderRadius: m,
    padding: m,
    minHeight: xl ,
  },
  profileImg: {
    width: l*10,
    height: l*10,
    borderRadius: l*10/2,
  },
});