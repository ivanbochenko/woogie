import { useRouter, useSegments } from "expo-router";
import { useEffect, useContext, createContext, useState, useMemo } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Provider as GqlProvider } from 'urql'
import { Axios } from 'axios'
import { apiClient, gqlClient, refreshToken } from '../lib/Client'
import { LocationType, useLocation } from "./Location";

type Context = {
  user: User,
  api: Axios,
  signIn(data: Data): void,
  signOut(): void,
  location: LocationType,
  maxDistance: number,
  setMaxDistance(num: number): void,
}

type Data = {
  id: string,
  token: string
}

type User = Data | null | undefined

const AuthContext = createContext<Context>(null!);

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user: User) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  useEffect(() => {
    if (user === undefined) return;
    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!user && rootSegment !== "(auth)") {
      // Redirect to the sign-in page.
      router.replace("/Intro1");
    } else if (user && rootSegment !== "(app)") {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, rootSegment]);
}

export function Provider(props: {children: JSX.Element}) {
  const { getItem, setItem, removeItem } = useAsyncStorage("USER")
  const [user, setAuth] = useState<User>(undefined)
  const location = useLocation()
  const [maxDistance, setMaxDistance] = useState(100)
  const client = gqlClient(user?.token)
  const api = apiClient(user?.token)
  
  useEffect(() => {
    getItem().then( async (json) => {
      if (json != null) {
        const USER = JSON.parse(json)
        const data = await refreshToken(USER.token)
        setAuth(data)
      } else {
        setAuth(null)
      }
    });
  }, []);
  
  const appContext = useMemo(() => ({
    signIn: (data: Data) => {
      setAuth(data);
      setItem(JSON.stringify(data));
    },
    signOut: () => {
      setAuth(null);
      removeItem();
    },
    user,
    api,
    location,
    maxDistance,
    setMaxDistance,
  }), [user, maxDistance, location])

  useProtectedRoute(user);

  return (
    <GqlProvider value={client}>
      <AuthContext.Provider value={appContext} >
        {props.children}
      </AuthContext.Provider>
    </GqlProvider>
  );
}