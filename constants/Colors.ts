import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const white = '#FFFCF7'
const platinum = '#E2E2E2'
// Colombia blue
const primary = '#C4E5FD'
// Argentinian blue
const action = '#46aef7'
const prussian = '#02233B'
const eerie = '#1F1F1F'
const black = '#010B13'
// const space = '#222844'

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
    card: prussian,
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
    card: prussian,
    text: white,
    border: eerie,
  },
};