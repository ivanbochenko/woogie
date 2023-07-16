import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";
import { useQuery } from 'urql';

import { BoldText, RegularText } from '@/components/StyledText'
import { Icon } from '@/components/Themed'
import { s, m, l, xl } from '@/constants/Spaces';
import User from "@/components/User";
import { REVIEWS_QUERY } from '@/lib/queries';

export default () => {
  const { colors } = useTheme()
  const { user_id } = useLocalSearchParams() as { user_id: string }
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: REVIEWS_QUERY,
    variables: { user_id }
  });

  if (fetching || error) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {fetching && <ActivityIndicator size="large" color={'gray'} /> }
      {error && <RegularText>Server error</RegularText> }
    </View>
  )
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={[styles.center, {padding: m}]}>
        {data?.reviews!.length
          ? data.reviews.map( (review: any, index: number) => {
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