import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useGlobalContext } from '~/providers/GlobalProvider';
export default function AuthLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="mfa" // Add the MFA screen here
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify" // Add the verify screen here
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
