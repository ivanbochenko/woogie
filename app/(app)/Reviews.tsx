import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, View } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { useSearchParams } from 'expo-router';
import Animated, {
  Layout,
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";
import { useQuery } from 'urql';

import { BoldText, RegularText } from '../../components/StyledText'
import { Icon } from '../../components/Themed'
import { s, m, l, xl } from '../../constants/Spaces';
import User from "../../components/User";
import { graphql } from '../../gql';

export default () => {
  const { colors } = useTheme()
  const isFocused = useIsFocused()
  const { user_id } = useSearchParams() as { user_id: string }
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: REVIEWS_QUERY,
    variables: { user_id },
    pause: !isFocused
  });

  if (fetching) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={'gray'} />
    </View>
  )
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={[styles.center, {padding: m}]}>
        {data?.reviews!.length
          ? data.reviews.map( (review) => {
            const { id, author, stars, text, time } = review!
            return (
              <Animated.View
                entering={FadeInLeft}
                exiting={FadeOutRight}
                layout={Layout.springify()}
                style={[styles.review, {backgroundColor: colors.border}]}
                key={id}
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
          })
          : <View style={styles.center}><BoldText>No reviews</BoldText></View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

const REVIEWS_QUERY = graphql(`
  query REVIEWS_QUERY($user_id: ID!) {
    reviews(user_id: $user_id) {
      id
      stars
      text
      time
      author {
        id
        name
        avatar
      }
    }
  }
`)