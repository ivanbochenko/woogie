import { create } from 'zustand';
import { Axios } from 'axios'
import { createSelectors } from './Selectors'
import { getToken, removeToken, setToken, getSwipes, setSwipes } from './Storage';
import { apiClient, refreshToken } from '../lib/Client'
import { LocationType, getLocation } from "./Location";

type Data = {
  id: string,
  token: string
}

interface AuthState {
  token: string | null | undefined,
  id: string | undefined,
  swipes: number,
  location: LocationType,
  maxDistance: number,
  setMaxDistance(num: number): void,
  getLocation: () => Promise<void>,
  hydrateSwipes: () => Promise<void>,
  incSwipes: () => Promise<void>,
  api(): Axios,
  signIn(data: Data): void,
  signOut(): void,
  hydrate: () => Promise<void>,
}

const _useAuth = create<AuthState>((set, get) => ({
  token: undefined,
  id: undefined,
  swipes: 0,
  location: null,
  maxDistance: 100,
  setMaxDistance: (maxDistance: number) => {
    set({maxDistance})
  },
  getLocation: async () => {
    const location = await getLocation();
    set({ location });
  },
  hydrateSwipes: async () => {
    const swipes = await getSwipes()
    if (swipes) {
      const dayAgoDate = () => new Date(new Date().getTime() - 60 * 60 * 24 * 1000)
      const freshSwipes = swipes.filter(swipe => new Date(swipe).getTime() > dayAgoDate().getTime())
      await setSwipes(freshSwipes)
      set({swipes: freshSwipes.length})
    }
  },
  incSwipes: async () => {
    const swipes = await getSwipes()
    await setSwipes([...swipes, new Date().toISOString()])
    set(state => ({swipes: state.swipes + 1}))
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
      const userToken = await getToken();
      if (!!userToken) {
        const data = await refreshToken(userToken)
        if (data) {
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