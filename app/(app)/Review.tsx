import React, { useState } from 'react';
import { StyleSheet, View, Pressable, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useMutation } from 'urql';
import { useSearchParams } from 'expo-router'

import { BoldText, TextInput } from '../../components/StyledText'
import { s, m, l, xl } from '../../constants/Spaces';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Themed'
import { useAuth } from '../../lib/Auth';
import { graphql } from '../../gql';

export default () => {
  const { colors } = useTheme();
  const { user } = useAuth()
  const author_id = user?.id!
  const { user_id } = useSearchParams() as { user_id: string }
  const [reviewResult, review] = useMutation(POST_REVIEW)
  const [value, setValue] = useState({
    author_id,
    user_id,
    text: '',
    stars: 0
  })
  
  const onSubmit = async () => {
    if (!value.text || !value.stars) {
      Alert.alert('Add text and stars')
      return
    }
    const result = await review(value)
    if (result.error) {
      Alert.alert('Error, review not sent')
    } else {
      Alert.alert('Review sent')
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <BoldText>Review user</BoldText>
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

const POST_REVIEW = graphql(`
  mutation POST_REVIEW($author_id: ID!, $user_id: ID!, $stars: Int!, $text: String!) {
    postReview(author_id: $author_id, stars: $stars, text: $text, user_id: $user_id) {
      id
    }
  }
`)