import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

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
