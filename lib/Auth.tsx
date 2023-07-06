import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Provider as GqlProvider } from 'urql'
import { gqlClient } from '../lib/Client'
import { useAuth } from "./State";

function useProtectedRoute(token: string | null | undefined) {
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (token === undefined) return;
    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!token && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace("/Intro1");
    } else if (token && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [token, segments]);
}

export function Provider(props: {children: JSX.Element}) {
  const token = useAuth.use.token()
  const client = gqlClient(token ?? '')
  useAuth.use.getLocation()()
  
  // useAuth.use.getProAccess()()
  useAuth.use.hydrateSwipes()()
  useProtectedRoute(token)

  return (
    <GqlProvider value={client}>
      {props.children}
    </GqlProvider>
  );
}