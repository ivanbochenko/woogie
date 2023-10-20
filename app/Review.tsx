import React, { useState } from 'react';
import { StyleSheet, View, Pressable, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router'

import { BoldText, TextInput } from '@/components/StyledText'
import { s, m, l, xl } from '@/constants/Spaces';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Themed'
import { useAuth } from '@/lib/State';

export default () => {
  const { colors } = useTheme();
  const id = useAuth.use.id()
  const app = useAuth.use.app()()
  const author_id = id!
  const { user_id } = useLocalSearchParams() as { user_id: string }
  const [value, setValue] = useState({
    author_id,
    user_id,
    text: '',
    stars: 0
  })
  
  const onSubmit = async () => {
    if (value.text && value.stars) {
      const result = await app.review.post(value)
      if (result.error) {
        Alert.alert('Error, review not sent')
      } else {
        Alert.alert('Review sent')
      }
    } else {
      Alert.alert('Add text and stars')
    }
    return
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <BoldText>Send user one review</BoldText>
        <View style={[styles.row, styles.rating, { backgroundColor: colors.card }]}>
          {[...Array(5)].map(( item, index ) =>
            <Pressable
              key={index}
              onPress={()=>setValue(value => ({...value, stars: ++index}))}
            >
              <Icon name="star" color={ value.stars <= index ? 'gray' : colors.primary }/>
            </Pressable>
          )}
        </View>
        <TextInput
          multiline
          maxLength={250}
          placeholder={'Review...'}
          onChangeText={ text => setValue(value => ({...value, text}))}
          value={value.text}
        />
        <Button title={'Send'} onPress={onSubmit}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: m,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rating: {
    alignItems: "center",
    justifyContent: 'space-evenly',
    padding: m,
    borderRadius: xl,
    marginTop: m,
    width: xl*5,
  },
});