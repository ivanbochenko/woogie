import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import Animated, {
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";
import { RegularText, BoldText } from '@/components/StyledText'
import { Icon } from '@/components/Themed'
import { s, m, l, xl } from '@/constants/Spaces';
import User from "@/components/User";
import { AVATAR } from '@/constants/images';
import { useAuth } from '@/lib/State';
import { useApp } from '@/lib/useApp';

export default () => {
  const { id, review } = useLocalSearchParams() as { id: string, review: string }
  const router = useRouter()
  const { colors } = useTheme()
  
  const app = useAuth.use.app()()
  const route = app.user[id].get
  const { response, fetching } = useApp(route)

  if (fetching || response?.error || !response?.data ) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {fetching
        ? <ActivityIndicator size="large" color={'gray'} />
        : <RegularText>Server error</RegularText>
      }
    </View>
  )

  const { avatar, name, age, bio, stars, recievedReviews } = response.data
  const image = avatar ? {uri: avatar} : AVATAR

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={[styles.center, {padding: m}]}>
        <Stack.Screen
          options={{
            headerRight: () => (
              review === 'true' ?
                <Icon
                  name="star"
                  color={'gray'}
                  onPress={() => router.push({pathname: 'Review', params: { user_id: id }})}
                  style={{marginRight: s}}
                />
              : null
            ),
            headerLeft: () => 
              <Icon
                name='exclamation-circle'
                color="gray"
                onPress={() => router.push({pathname: 'Report', params: {user_id: id}})}
              />
          }}
        />
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

        {recievedReviews!.map((review: any, index: number) => {
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