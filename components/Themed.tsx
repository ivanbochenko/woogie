/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  Pressable as DefaultPressable,
  TextInput,
  PressableProps as DefaultPressableProps,
  ViewStyle
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type PressableProps = ThemeProps & DefaultPressableProps;
export type InputProps = ThemeProps & TextInput['props'];
export type IconProps = React.ComponentProps<typeof FontAwesome>

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Pressable(props: PressableProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');

  return <DefaultPressable style={({pressed}) => [({ backgroundColor: pressed ? borderColor : tintColor }), style]} {...otherProps} />;
}

export function Input(props: InputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');

  return <TextInput style={[{ backgroundColor, color }, style]} {...otherProps} />;
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export function Icon(props: IconProps) {
  const { style, color, ...otherProps } = props;
  const theme = useColorScheme() ?? 'light';
  const defaultColor = Colors[theme]['tint'];

  return <FontAwesome size={25} style={[{ color: color ?? defaultColor }, style]} {...otherProps}/>;
}