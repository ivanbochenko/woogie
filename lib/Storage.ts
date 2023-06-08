import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN = 'token'

const SWIPES = 'swipes'

async function setItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

async function mergeItem<T>(key: string, value: T) {
  await AsyncStorage.mergeItem(key, JSON.stringify(value))
}

async function getItem<T>(key: string): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  return !!value ? JSON.parse(value) : null;
}

async function getArray<T>(key: string): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  return !!value ? JSON.parse(value) : [];
}

async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}

export const setToken = (value: string) => setItem<string>(TOKEN, value);
export const getToken = () => getItem<string>(TOKEN);
export const removeToken = () => removeItem(TOKEN);

export const setSwipes = (value: string[]) => setItem<string[]>(SWIPES, value);
export const getSwipes = () => getArray<string[]>(SWIPES);
export const removeSwipes = () => removeItem(SWIPES);