import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router'
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { BoldText, RegularText, TextInput } from '@/components/StyledText'
import { s, m, l, xl } from '@/constants/Spaces';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/State';

const reasons = [
  'There`s nudity or something sexually explicit',
  'Someone is selling something',
  'Hate or violence involved',
  'Racism or personal discrimination',
  'Illegal activity'
]
interface Params { user_id?: string, event_id?: string }
type ValueData = Params & { reason: string, text: string, author_id: string }

export default () => {
  const { colors } = useTheme()
  const router = useRouter()
  const id = useAuth.use.id()
  const app = useAuth.use.app()()
  const { user_id, event_id } = useLocalSearchParams() as Params
  const [blockUser, setBlockUser] = useState(false)
  const [value, setValue] = useState<ValueData>({
    author_id: id!,
    event_id,
    user_id,
    reason: '',
    text: '',
  })
  
  const verticalStaticData = reasons.map((reason, index) => (
    {
      id: index.toString(),
      text: reason,
      unfillColor: colors.card,
      fillColor: colors.primary,
      textStyle: styles.textStyle,
      style: { marginTop: m },
      innerIconStyle: { borderWidth: 0 }
    }
  ))
  
  const onSubmit = async () => {
    if (!value.text || !value.reason) {
      return Alert.alert('Add reason and text')
    }
    let res
    if (event_id) {
      res = await app.event.report.post({...value, event_id})
    }
    if (user_id) {
      res = await app.user.report.post({...value, user_id})
    }
    // user_id might be unspecified
    if (blockUser) {
      await app.user.block.post({id: id!, user_id: user_id!})
    }

    if (res?.status !== 200 ) {
      return Alert.alert('Error, try again')
    }
    router.back()
  }

  return (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-100} style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <BoldText>Provide a reason and text for your report</BoldText>
        <BouncyCheckboxGroup
          data={verticalStaticData}
          style={{ flexDirection: "column" }}
          onChange={(item: ICheckboxButton) => setValue(v => ({...v, reason: item?.text!}))}
        />
        <TextInput
          multiline
          numberOfLines={8}
          maxLength={500}
          placeholder={'Report text...'}
          onChangeText={ text => setValue(value => ({...value, text}))}
          value={value.text}
        />
        {user_id &&
          <View style={styles.row}>
            <BouncyCheckbox
              fillColor={colors.primary}
              unfillColor={colors.card}
              innerIconStyle={{ borderWidth: 0 }}
              onPress={setBlockUser}
            />
            <RegularText>Block user</RegularText>
          </View>
        }
        <Button title={'Send'} onPress={onSubmit}/>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: m,
    // gap: m,
  },
  textStyle: {
    fontFamily: 'Lato_400Regular',
    textDecorationLine: 'none'
  },
  row: {
    width: '100%',
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: m
  },
});