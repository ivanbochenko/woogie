import { create } from 'zustand';
import { Axios } from 'axios'
import * as Location from 'expo-location'
import type { LocationObjectCoords } from 'expo-location'
import { createSelectors } from './Selectors'
import { getToken, removeToken, setToken, getSwipes, setSwipes, removeSwipes } from './Storage';
import { apiClient } from '../lib/Client'
import { registerNotifications } from './Notification';
import { isPro } from './Purchases';
import { HOURS_TO_NEW_SWIPES } from '../constants/Config'

const bridge = () => new Date(new Date().getTime() - 3600000 * HOURS_TO_NEW_SWIPES)

type Data = {
  id: string,
  token: string
}

interface AuthState {
  token: string | null | undefined,
  id: string | undefined,
  pro: boolean,
  swipes: number,
  location: LocationObjectCoords | null | undefined,
  maxDistance: number,
  setMaxDistance(num: number): void,
  getLocation(): Promise<void>,
  hydrateSwipes(): Promise<void>,
  addSwipe(): Promise<void>,
  getProAccess(): Promise<void>,
  api(): Axios,
  signIn(data: Data): void,
  signOut(): void,
  hydrate(): Promise<void>,
}

const _useAuth = create<AuthState>((set, get) => ({
  token: undefined,
  id: undefined,
  pro: false,
  swipes: 0,
  location: undefined,
  maxDistance: 100,
  setMaxDistance: (maxDistance: number) => {
    set({maxDistance})
  },
  getLocation: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
      const location = (await Location.getCurrentPositionAsync({})).coords
      set({ location })
    } else {
      set({ location: null })
    }
  },
  hydrateSwipes: async () => {
    const swipes = await getSwipes()
    if (swipes.length) {
      const freshSwipes = swipes.filter(swipe => new Date(swipe).getTime() > bridge().getTime())
      set({swipes: freshSwipes.length})
      await setSwipes(freshSwipes)
    }
  },
  addSwipe: async () => {
    set(state => ({swipes: state.swipes + 1}))
    const swipes = await getSwipes()
    await setSwipes([...swipes, new Date().toISOString()])
  },
  getProAccess: async () => {
    set({pro: await isPro(get().id!)})
  },
  api: () => {
    apiClient.defaults.headers.common['Authorization'] = get().token
    return apiClient
  },
  signIn: ({token, id}: Data) => {
    setToken(token);
    set({ token, id });
  },
  signOut: () => {
    removeToken();
    set({ token: null });
  },
  hydrate: async () => {
    try {
      let hasToSignOut = true
      const token = await getToken();
      if (!!token) {
        const pushToken = await registerNotifications()
        const { status, data } = await apiClient.post(`login`, {token, pushToken})
        if (status === 200) {
          hasToSignOut = false
          get().signIn(data)
        }
      }
      if (hasToSignOut) get().signOut();
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (data: Data) => _useAuth.getState().signIn(data);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const api = () => _useAuth.getState().api();