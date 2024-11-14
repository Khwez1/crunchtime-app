import '../global.css';
import { Stack } from 'expo-router';
import GlobalProvider from '~/providers/GlobalProvider';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="carts/index" />
        <Stack.Screen name="cart/[id]" />
        <Stack.Screen name="restaurantDetails/[id]" />
        <Stack.Screen name="dishDetails/[id]" />
      </Stack>
    </GlobalProvider>
  );
}
