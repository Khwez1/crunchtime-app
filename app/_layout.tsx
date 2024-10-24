import '../global.css';

import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack>
      {/* <Stack.Screen options={{ headerShown: false }} name="index" /> */}
      {/* <Stack.Screen options={{ headerShown: false }} name="(tabs)" /> */}
      <Stack.Screen options={{ headerShown: false }} name="restaurantDetails/[id]" />
    </Stack>
  );
}
