import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, Pressable, TextInput, SafeAreaView, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSubscription, useMutation } from 'urql';
import { useSearchParams, useRouter, Stack } from 'expo-router'
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
import { useAuth } from '../../lib/Auth'
import { graphql } from '../../gql';

export default () => {
  const { title, event_id } = useSearchParams() as { title: string, event_id: string }
  const router = useRouter()
  const { colors } = useTheme()
  const { user, api } = useAuth()
  const id = user?.id!

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
          query ($event_id: ID!) {
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
      if (status == 200) {
        setMessages(data.data.messages)
      }
      setFetching(false)
    })()
    Keyboard.addListener('keyboardWillShow', (e) => setKeyboardHeight(e.endCoordinates.height))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardHeight(0))
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow')
      Keyboard.removeAllListeners('keyboardWillHide')
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
        author_id: id,
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
    <SafeAreaView style={{flex: 1}}>
      <Stack.Screen
        options={{
          title,
          headerRight: () =>
            <Pressable onPress={() => router.push({pathname: 'Event', params: { event_id }})}>
              <Icon style={{marginRight: s}} name="ticket" color={'gray'} />
            </Pressable>
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
            id={id}
            data={item}
            renderAvatar={(array[index-1]?.author.id ?? null) !== item.author.id}
            onPress={()=>router.push({pathname: "User", params: {id: item.author.id, review: true}})}
          />
        )}
      </ScrollView>
      <View style={{
        position: 'absolute',
        alignItems: "center",
        flexDirection: "row",
        width: width-l,
        borderRadius: l,
        marginHorizontal: m,
        minHeight: xl+m,
        padding: m,
        backgroundColor: colors.card,
        bottom: keyboardHeight + m
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
  renderAvatar: boolean,
  onPress(): void,
  id: string
}) => {
  const {data, renderAvatar, onPress, id} = props
  const { colors } = useTheme()
  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutRight}
      layout={Layout.springify()}
      style={styles.row}
    >
      {!renderAvatar
        ? <View style={{width: 60 + m}}/>
        : <Pressable onPress={onPress}>
            <Image
              style={styles.profileImg}
              source={data.author.avatar ? {uri: data.author.avatar} : require('../../assets/images/avatar.png')}
            />
          </Pressable>
      }
      <View style={[styles.card, { backgroundColor: data.author.id === id ? colors.card : colors.border }]}>
        <RegularText>{data.text}</RegularText>
        <RegularText style={{color: 'gray', marginTop: s }}>
          {new Date(data.time).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")}
        </RegularText>
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
    paddingHorizontal: m,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    overflow: "hidden",
    marginRight: m,
  },
});

const POST_MESSAGE = graphql(`
  mutation POST_MESSAGE($text: String!, $event_id: ID!, $author_id: ID!) {
    postMessage(text: $text, event_id: $event_id, author_id: $author_id) {
      id
    }
  }
`)

const MessagesSubscription = `
  subscription MESSAGES_SUB($event_id: ID!) {
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