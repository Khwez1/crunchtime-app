import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="addCard"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="saveCard"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
