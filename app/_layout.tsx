import '../global.css';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      <Stack.Screen options={{ headerShown: false }} name="restaurantDetails/[id]" />
      <Stack.Screen options={{ headerShown: false }} name="restaurantDetails/dishDetails/[dishId]" />
    </Stack>
  );
}
