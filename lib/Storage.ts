import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoreApi, UseBoundStore } from 'zustand';

const TOKEN = 'token';

async function setItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

async function getItem<T>(key: string): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  return value != null ? JSON.parse(value) : null;
}

async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}

export const setToken = (value: string) => setItem<string>(TOKEN, value);
export const getToken = () => getItem<string>(TOKEN);
export const removeToken = () => removeItem(TOKEN);

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};