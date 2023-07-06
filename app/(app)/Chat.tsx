import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, Pressable, TextInput, SafeAreaView, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSubscription, useMutation, gql } from 'urql';
import { useGlobalSearchParams, useRouter, Stack } from 'expo-router'
import Animated, {
  Layout,
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons'

import { s, m, l, xl } from '../../constants/Spaces'
import { height, width } from '../../constants/Layout';
import { RegularText } from '../../components/StyledText'
import { View, Icon } from '../../components/Themed'
import { useAuth } from '../../lib/State'
import { POST_MESSAGE } from '../../lib/queries';

export default () => {
  const { title, event_id } = useGlobalSearchParams() as { title: string, event_id: string }
  const router = useRouter()
  const { colors } = useTheme()
  const id = useAuth.use.id()
  const api = useAuth.use.api()()

  const [fetching, setFetching] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const inputRef = useRef<TextInput>(null)
  const scrollRef = useRef<ScrollView>(null)

  // Load previous messages
  
  useEffect(() => {
    (async () => {
      setFetching(true)
      const { status, data } = await api.post('graphql', {
        query: `
          query ($event_id: String!) {
            messages(event_id: $event_id) {
              id
              time
              text
              author {
                id
                name
                avatar
              }
            }
          }
        `,
        variables: { event_id }
      })
      if (status === 200) {
        setMessages(data.data.messages)
      }
      setFetching(false)
    })()
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => setKeyboardHeight(e.endCoordinates.height))
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => setKeyboardHeight(0))
    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()      
    }
  }, [])
  
  // Subscribe to new messages

  const [res] = useSubscription({
    query: MessagesSubscription, variables: { event_id }
  },
    (messages = [], response) => [ ...messages, response.messages ] 
  )

  // Send message
  
  const [messagePostResult, messagePost] = useMutation(POST_MESSAGE);
  
  const onSubmit = async () => {
    const text = input
    inputRef.current!.clear()
    if (text) {
      const result = await messagePost({
        text,
        event_id,
        author_id: id!,
      })
      if (result.error) console.error('Oh no!', result.error);
    }
  }
  
  if (fetching) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={'gray'} />
    </View>
  )
  
  return (
    <SafeAreaView style={{flex: 1, padding: m, alignItems: 'center'}}>
      <Stack.Screen
        options={{
          title,
          headerRight: () =>
            <Icon
              onPress={() => router.push({pathname: 'Event', params: { event_id }})}
              name="ticket"
              color={'gray'}
            />
        }}
      />
      <ScrollView
        keyboardDismissMode='on-drag'
        overScrollMode={'never'}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current!.scrollToEnd()}
        contentContainerStyle={{paddingBottom: keyboardHeight + 68}}
      >
        {[...(messages ?? []), ...(res.data ?? [])].map((item, index, array) =>
          <Message
            key={item?.id}
            data={item}
            renderAvatar={(array[index-1]?.author.id ?? null) !== item.author.id}
          />
        )}
      </ScrollView>
      <View style={{
        position: 'absolute',
        alignItems: "center",
        flexDirection: "row",
        flex: 1, 
        borderRadius: l,
        minHeight: xl+m,
        padding: m,
        margin: m,
        backgroundColor: colors.card,
        bottom: keyboardHeight,
      }}>
        <TextInput
          ref={inputRef}
          editable
          multiline
          textAlignVertical='center'
          onFocus={() => scrollRef.current!.scrollToEnd()}
          maxLength={200}
          placeholder={'Message...'}
          placeholderTextColor={'gray'}
          onChangeText={text => setInput(text)}
          value={input}
          onSubmitEditing={onSubmit}
          style={{ flex: 1, marginBottom: s, color: colors.text, fontFamily: 'Lato_400Regular', fontSize: 16 }}
        />
        <Pressable onPress={onSubmit}>
          <Ionicons name="send" size={25} color={colors.primary}/>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const Message = (props: {
  data: {
    text: string,
    time: string,
    author: {
      avatar: string,
      id: string,
    }
  },
  renderAvatar: boolean
}) => {
  const { data, renderAvatar } = props
  const user_id = useAuth().id!
  const { colors } = useTheme()
  const router = useRouter()
  const backgroundColor = data.author.id === user_id ? colors.card : colors.border
  const time = new Date(data.time).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")
  const image = data.author.avatar ? {uri: data.author.avatar} : require('../../assets/images/avatar.png')
  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutRight}
      layout={Layout.springify()}
      style={styles.row}
    >
      {renderAvatar
        ? <Pressable
            onPress={() => router.push({pathname: "User", params: {id: data.author.id, review: true}})}
          >
            <Image
              style={styles.profileImg}
              source={image}
            />
          </Pressable>
        : <View style={{width: 60 + m}}/>
      }
      <View style={[styles.card, { backgroundColor }]}>
        <RegularText>{data.text}</RegularText>
        <RegularText style={{color: 'gray', marginTop: s }}>{time}</RegularText>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    // borderTopLeftRadius: m,
    borderTopRightRadius: l,
    borderBottomRightRadius: l,
    borderBottomLeftRadius: l,
    maxWidth: width-m-l-60,
    padding: m,
    justifyContent: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: m,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    overflow: "hidden",
    marginRight: m,
  },
});

const MessagesSubscription = gql`
  subscription MESSAGES_SUB($event_id: String!) {
    messages(event_id: $event_id) {
      id
      time
      text
      author {
        id
        name
        avatar
        created_at
      }
    }
  }
`