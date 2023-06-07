import { create } from 'zustand';
import { Axios } from 'axios'
import { createSelectors, getToken, removeToken, setToken } from './Storage';
import { apiClient, refreshToken } from '../lib/Client'
import { LocationType, getLocation } from "./Location";

type Data = {
  id: string,
  token: string
}

interface AuthState {
  token: string | null | undefined,
  id: string | undefined,
  api(): Axios,
  signIn(data: Data): void,
  signOut(): void,
  hydrate: () => Promise<void>,
  location: LocationType,
  getLocation: () => Promise<void>
  maxDistance: number,
  setMaxDistance(num: number): void,
}

const _useAuth = create<AuthState>((set, get) => ({
  token: undefined,
  id: undefined,
  location: null,
  maxDistance: 100,
  getLocation: async () => {
    const location = await getLocation();
    set({ location });
  },
  setMaxDistance: (maxDistance: number) => {
    set({maxDistance})
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
      if (userToken !== null) {
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