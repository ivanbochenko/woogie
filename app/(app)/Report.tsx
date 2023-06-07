import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter, useSearchParams } from 'expo-router'
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useMutation } from 'urql'
import { BoldText, RegularText, TextInput } from '../../components/StyledText'
import { s, m, l, xl } from '../../constants/Spaces';
import { Button } from '../../components/Button';
import { useAuth } from '../../lib/State';
import { graphql } from '../../gql';
import { View } from '../../components/Themed';

const reasons = [
  'There`s nudity or something sexually explicit',
  'Someone is selling something',
  'Hate or violence involved',
  'Racism or personal discrimination',
  'Illegal activity'
]

type Params = { user_id: string | undefined, event_id: string | undefined }
type ValueData = Params & {reason: string | null, text: string}

export default () => {
  const { colors } = useTheme();
  const id = useAuth.use.id()
  const api = useAuth.use.api()()
  const router = useRouter()
  const { user_id, event_id } = useSearchParams() as Params
  const [blockUser, setBlockUser] = useState(false)
  const [blockResult, block] = useMutation(BLOCK)
  const [value, setValue] = useState<ValueData>({
    event_id,
    user_id,
    reason: null,
    text: '',
  })
  
  const verticalStaticData = reasons.map((value, index) => (
    {
      id: index,
      text: value,
      unfillColor: colors.card,
      fillColor: colors.primary,
      textStyle: styles.textStyle,
      style: { marginTop: m },
      innerIconStyle: { borderWidth: 0 }
    }
  ))
  
  const onSubmit = async () => {
    if (!value.text || !value.reason) {
      Alert.alert('Add reason and text')
      return
    }
    let res
    event_id && (res = await api.post('report/event', value))
    user_id && (res = await api.post('report/user', value))
    blockUser && (await block({id: id!, user_id: user_id!}))

    if (res?.status !== 200 ) {
      Alert.alert(res?.data?.message ?? 'Error, try again')
      return
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

const BLOCK = graphql(`
  mutation BLOCK($id: String!, $user_id: String!) {
    block(id: $id, user_id: $user_id)
  }
`)