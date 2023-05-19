import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
  ActivityIndicator,
  PressableProps,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Pressable } from './Themed';
import { BoldText } from './StyledText';
import { s, m, l, xl } from '../constants/Spaces'

export const Button = (
  props: PressableProps & {
    title: string,
    onPress: (() => Promise<{}>) | (() => void),
  }
) => {

  const { title, onPress, style, ...other } = props
  const [loading, setLoading] = useState(false)

  return (
    <Pressable
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={{
        paddingVertical: m,
        minHeight: xl+4,
        borderRadius: xl,
        width: 150,
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

export const PrimaryButton = ({
  onPress,
  label,
  style,
  labelStyle,
}: {
  onPress?: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 32,
          height: 52,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          {
            fontSize: 16,
            fontFamily: 'Lato_400Regular',
            fontWeight: "600",
            color: theme.colors.background
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
