import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Pressable, ActivityIndicator, Image, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useQuery } from 'urql';
import { useSearchParams, useRouter, Stack } from 'expo-router'
import Animated, {
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";
import { RegularText, BoldText } from '../../components/StyledText'
import { Icon } from '../../components/Themed'
import { s, m, l, xl } from '../../constants/Spaces';
import User from "../../components/User";
import { graphql } from '../../gql';

const USER_QUERY = graphql(`
  query USER_QUERY($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      age
      stars
      bio
      recievedReviews {
        id
        time
        text
        stars
        author {
          id
          name
          avatar
        }
      }
    }
  }
`)

export default () => {
  const { id, review } = useSearchParams() as { id: string, review: string }
  const router = useRouter()
  const { colors } = useTheme()
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: USER_QUERY,
    variables: { id }
  });
  
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

  const { avatar, name, age, bio, stars, recievedReviews } = data?.user!
  const image = avatar ? {uri: avatar} : require('../../assets/images/avatar.png')

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={[styles.center, {padding: m}]}>
        {review === 'true' ? 
          <Stack.Screen options={{
            headerRight: () =>
              <Pressable onPress={() => router.push({pathname: 'Review', params: { user_id: id }})}>
                <Icon style={{marginRight: s}} name="star" color={'gray'} />
              </Pressable>
          }}/> : null
        }
        <Image style={styles.profileImg} source={image} />

        <BoldText style={{ marginTop: m}}>{name ?? 'Name'}, {age ?? 'age'}</BoldText>

        <View style={[styles.starRow, { backgroundColor: colors.card }]} >
          {[...Array(5)].map(( item, index ) =>
            <Icon
              key={index}
              name="star"
              color={stars! <= index ? 'gray' : colors.primary}
            />
          )}
        </View>

        <RegularText>{bio}</RegularText>

        {recievedReviews!.map((review, index) => {
          const { author, stars, text, time } = review!
          return (
            <Animated.View
              entering={FadeInLeft.delay(index*100).springify()}
              exiting={FadeOutRight}
              style={[styles.review, {backgroundColor: colors.border}]}
              key={index}
            >
              <View style={styles.row}>
                <User {...author}/>

                <View style={{flex: 1}}>
                  <View style={[styles.row, styles.rating]}>
                    {[...Array(5)].map(( item, index ) => (
                      <Icon
                        key={index}
                        name="star"
                        color={stars <= index ? 'gray' : colors.primary}
                      />
                    ))}
                  </View>
                  
                  <RegularText>{text}</RegularText>
                </View>
              </View>

              <RegularText style={{color: 'gray', paddingTop: m}}>
                {new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")}
              </RegularText>
            </Animated.View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  starRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: 'space-evenly',
    padding: m,
    borderRadius: xl,
    marginVertical: m,
    width: xl*5,
  },
  profileImg: {
    width: 180,
    height: 180,
    borderRadius: 180/2,
  },
  review: {
    alignItems: "center",
    padding: m,
    marginTop: m,
    borderRadius: l,
  },
  rating: {
    justifyContent: 'space-between',
    marginBottom: m,
    marginRight: l*3
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});