import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const white = '#FFFCF7'
const platinum = '#E2E2E2'
const colombia = '#C4E5FD'
const argentina = '#46aef7'
const prussian = '#02233B'
const eerie = '#1F1F1F'
const black = '#010B13'
// const space = '#222844'

export default {
  light: {
    text: black,
    background: white,
    tint: argentina,
    card: colombia,
    border: platinum,
  },
  dark: {
    text: white,
    background: black,
    tint: argentina,
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
    primary: argentina,
    card: colombia,
    border: platinum,
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    text: white,
    background: black,
    primary: argentina,
    card: prussian,
    border: eerie,
  },
};