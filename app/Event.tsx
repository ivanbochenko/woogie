import React from 'react'
import { View, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView, FlatList, ImageBackground } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { s, m, l, xl } from '@/constants/Spaces';
import { height, width } from '@/constants/Layout';
import { RegularText, BoldText } from '@/components/StyledText'
import User from '@/components/User'
import Map from '@/components/Map';
import { PLACEHOLDER } from '@/constants/images';
import { useAuth } from '@/lib/State';
import { useApp } from '@/lib/useApp';

export default () => {
  const { colors } = useTheme()
  const { event_id } = useLocalSearchParams() as {event_id: string}
  
  const app = useAuth.use.app()()
  const route = app.event[event_id].get
  const { response, fetching } = useApp(route)

  if (fetching || response?.error || !response?.data ) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {fetching
        ? <ActivityIndicator size="large" color={'gray'} />
        : <RegularText>Server error</RegularText>
      }
    </View>
  )

  const { title, text, time, photo, author, matches, latitude, longitude } = response.data
  const users = matches?.map((item: any) => item?.user)
  const image = photo ? {uri: photo} : PLACEHOLDER

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.border, borderRadius: l, overflow: 'hidden', width: '100%'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          bounces={false}
        >
          <ImageBackground source={image} style={{height: height-height/6.3, justifyContent: 'flex-end'}}>
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent']}
              start={{x: 0.5, y: 1}}
              end={{x: 0.5, y: 0}}
            >
              <View style={styles.headRow}>
                <BoldText style={{ fontSize: l, color: 'white', maxWidth: width-xl*3 }}>{title}</BoldText>
              </View>
            </LinearGradient>
          </ImageBackground>

          <View style={{padding: s*3, gap: m}}>
            
            <BoldText>{new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")}</BoldText>
            
            <RegularText>{text}</RegularText>
            
            <FlatList
              showsHorizontalScrollIndicator={false}
              overScrollMode={'never'}
              horizontal={true}
              data={[author, ...users!]}
              renderItem={({item}) => <User {...item!}/>}
            />
            
            <Map latitude={latitude!} longitude={longitude!} height={200}/>
            
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: s
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'flex-end',
  },
  headRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s*3,
    minHeight: xl*2,
  },
  distance: {
    borderRadius: l,
    padding: m,
  },
});
