import '../global.css';
import { Stack } from 'expo-router';
import GlobalProvider from '~/providers/GlobalProvider';
import CartProvider  from '~/providers/CartProvider';
import OrderProvider from '~/providers/OrderProvider';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GlobalProvider>
      <CartProvider>
        <OrderProvider>
          <Stack
          screenOptions={{
            headerShown: false
          }}>
            {/* <Stack.Screen name="(auth)" /> */}
            {/* <Stack.Screen name="(tabs)" /> */}
            <Stack.Screen name="carts/index" />
            <Stack.Screen name="cart/[id]" />
            <Stack.Screen name="checkout/[id]" />
            <Stack.Screen name="restaurantDetails/[id]" />
            <Stack.Screen name="dishDetails/[id]" />
          </Stack>
        </OrderProvider>
      </CartProvider>
    </GlobalProvider>
  );
}
