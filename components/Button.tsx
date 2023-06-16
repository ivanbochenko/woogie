import React, { useState } from 'react';
import {
  ActivityIndicator,
  PressableProps,
  View,
  Pressable as DefaultPressable
} from "react-native";
import { Pressable } from './Themed';
import { BoldText } from './StyledText';
import { s, m, l, xl } from '../constants/Spaces'
import { Sparkles } from '../assets/artworks/Sparkles';
import { useTheme } from '@react-navigation/native';

export const Button = (
  props: PressableProps & {
    title: string,
    onPress(): Promise<void> | void,
  }
) => {
  const { title, onPress, ...other } = props
  const [loading, setLoading] = useState(false)

  return (
    <Pressable
      disabled={loading}
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={{
        paddingVertical: m,
        minHeight: xl+4,
        borderRadius: xl,
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        marginTop: m,
      }}
      {...other}
    >
      {loading
        ? <ActivityIndicator size='small' color={'gray'} />
        : <BoldText>{title}</BoldText>
      }
    </Pressable>
  );
}

export const PrimaryButton = (
  props: PressableProps & {
    title: string,
    onPress(): Promise<void> | void,
  }
) => {
  const { colors } = useTheme()
  const { title, onPress, ...other } = props
  const [loading, setLoading] = useState(false)

  return (
    <DefaultPressable
      disabled={loading}
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={({pressed}) => ({
        paddingVertical: m,
        minHeight: xl+4,
        borderRadius: xl,
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        marginTop: m,
        backgroundColor: pressed ? colors.border : colors.primary
      })}
      {...other}
    >
      {loading
        ? <ActivityIndicator size='small' color={'gray'} />
        : <BoldText>{title}</BoldText>
      }
    </DefaultPressable>
  );
}

export const SparkleButton = (
  props: PressableProps & {
    title: string,
    onPress(): Promise<void> | void,
  }
) => {

  const { title, onPress, style, ...other } = props
  const [loading, setLoading] = useState(false)

  return (
    <Pressable
      disabled={loading}
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={{
        paddingVertical: m,
        minHeight: xl+4,
        borderRadius: xl,
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        marginTop: m,
      }}
      {...other}
    >
      {loading
        ? <ActivityIndicator size='small' color={'gray'} />
        :
        <View style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}>
          <Sparkles/>
          <BoldText style={{marginHorizontal: m}}>{title}</BoldText>
          <Sparkles/>
        </View>
      }
    </Pressable>
  );
}

export const Square = (props: {
  icon: JSX.Element;
  onPress: (() => Promise<{}>) | (() => void);
}) => {
  const {icon, onPress, ...other} = props
  const [loading, setLoading] = useState(false)
  return (
    <Pressable
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={{
        width: xl*2,
        height: xl*2,
        borderRadius: l,
        alignItems: "center",
        justifyContent: "center",

      }}
      {...other}
    >
      {loading ? <ActivityIndicator size="large" color={'gray'} /> : icon }
    </Pressable>
  )
}

