import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Alert, Image, View, Pressable } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { useRouter, Stack } from 'expo-router';
import { useMutation } from 'urql';
import { Button, Square } from "../../../components/Button";
import { Icon } from '../../../components/Themed';
import BottomSheet from '@gorhom/bottom-sheet';
import { getResizedPhotoUrl } from '../../../lib/getPhotoUrl'
import { useAuth } from '../../../lib/Auth'
import { s, m, l, xl } from '../../../constants/Spaces';
import { RegularText, TextInput } from '../../../components/StyledText';
import { useTheme } from '@react-navigation/native';
import { graphql } from '../../../gql';

export default (props: {
  id: string,
  name: string,
  age: number,
  avatar: string,
  sex: string,
  bio: string
}) => {
  const router = useRouter()
  const { colors } = useTheme()
  const { api } = useAuth()
  const [photoShow, setPhotoShow] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [value, setValue] = useState(props)

  const launchPicker = async (pickFromCamera: boolean) => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    }
    const photo = pickFromCamera ?
      (await ImagePicker.launchCameraAsync(options)) :
      (await ImagePicker.launchImageLibraryAsync(options))
    setPhotoShow(false)
    if (!photo.canceled) {
      const avatar = await getResizedPhotoUrl({
        photo: photo.assets[0],
        width: 240, 
        height: 240, 
        url: (await api.get(`s3url`)).data
      })
      setValue(value => ({...value, avatar}))
    }
  }

  const [editProfileResult, editProfile] = useMutation(EDIT_PROFILE);
  const onSubmit = async () => {
    if (!value.name || !value.age || !value.sex) {
      Alert.alert('Add name, age and sex')
      return
    }
    await editProfile({...value})
    router.back()
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Screen options={{ title: 'Edit profile' }} />
      <ScrollView contentContainerStyle={styles.center}>
        <Pressable style={{borderRadius: 90}} onPress={()=> bottomSheetRef.current?.expand()}>
          <Image style={styles.profileImg} source={value.avatar ? {uri: value.avatar} : require('../../../assets/images/avatar.png')} />
        </Pressable>
        <TextInput
          maxLength={50}
          placeholder={'Name...'}
          onChangeText={ name => setValue(value => ({...value, name}))}
          value={value.name}
        />
        <TextInput
          keyboardType='numeric'
          maxLength={2}
          placeholder={'Age...'}
          onChangeText={ age => setValue(value => ({...value, age: parseInt(age)}))}
          value={value.age.toString() ?? ''}
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
          value={value.bio}
        />

        <Button title={'Save'} onPress={onSubmit}/>
      </ScrollView>

      {/* Photo bottomsheet */}
      <BottomSheet 
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={useMemo(() => ['25%', '50%'], [])}
      >
        <View style={[styles.center, styles.row, {justifyContent: 'space-evenly'}]}>
          <Square
            onPress={async () => await launchPicker(true)}
            icon={<Icon name="camera" size={xl} />}
          />
          <Square
            onPress={async () => await launchPicker(false)}
            icon={<Icon name="image" size={xl}/>}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
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

const EDIT_PROFILE = graphql(`
  mutation EDIT_PROFILE($id: ID!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {
    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {
      id
    }
  }
`)