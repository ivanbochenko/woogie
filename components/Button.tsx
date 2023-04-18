import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Pressable } from './Themed';
import { BoldText } from './StyledText';
import { s, m, l, xl } from '../constants/Spaces'

export const Button = (
  props: {
    title?: string;
    onPress: (() => Promise<{}>) | (() => void);
  }
) => {

  const { title, onPress, ...other } = props
  const [loading, setLoading] = useState(false)

  return (
    <Pressable
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={{
        height: xl+l,
        borderRadius: xl,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
        marginTop: m,
      }}
      {...other}
    >
      {loading
        ? <ActivityIndicator size="large" color={'gray'} />
        : <BoldText>{title}</BoldText>
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