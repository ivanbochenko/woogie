import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const platinum = '#ECE9EA'
const primary = '#C4E5FD'
const action = '#46aef7'
const white = '#FFFCF7'
const black = '#071013'
const space = '#222844'
const eerie = '#191F24'

export default {
  light: {
    text: black,
    background: white,
    tint: action,
    card: primary,
    border: platinum,
  },
  dark: {
    text: white,
    background: black,
    tint: action,
    card: space,
    border: eerie,
  },
};


export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: black,
    background: white,
    primary: action,
    card: primary,
    border: platinum,
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: action,
    background: black,
    card: space,
    text: white,
    border: eerie,
  },
};