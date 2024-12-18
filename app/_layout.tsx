import '../global.css';
import { Stack } from 'expo-router';
import GlobalProvider from '~/providers/GlobalProvider';
import CartProvider from '~/providers/CartProvider';
import OrderProvider from '~/providers/OrderProvider';

export const unstable_settings = {
  initialRouteName: '(tabs)', // Ensure this is set correctly
};

export default function RootLayout() {
  return (
    <GlobalProvider>
      <CartProvider>
        <OrderProvider>
          <Stack
            screenOptions={{
              headerShown: false, // Disable default headers for stack
            }}
          >
            {/* Tabs layout */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Other screens */}
            <Stack.Screen name="restaurantDetails/[id]" />
            <Stack.Screen name="dishDetails/[id]" />
          </Stack>
        </OrderProvider>
      </CartProvider>
    </GlobalProvider>
  );
}
