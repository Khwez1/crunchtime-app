import '../global.css';
import { Stack } from 'expo-router';
import GlobalProvider from '~/providers/GlobalProvider';
import CartProvider  from '~/providers/CartProvider';
import OrderProvider from '~/providers/OrderProvider';

export default function RootLayout() {
  return (
    <GlobalProvider>
      <CartProvider>
        <OrderProvider>
          <Stack
            screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="(cards)" />
            <Stack.Screen name="cart/[id]" />
            <Stack.Screen name="checkout/[id]" />
            <Stack.Screen name="order/order" />
            <Stack.Screen name="search/[query]" />
            <Stack.Screen name="Room" />
            <Stack.Screen 
              name="restaurantDetails/[id]"
              options={{ 
                headerShown: true,
              }} 
            />
            <Stack.Screen name="dishDetails/[id]" />
          </Stack>
        </OrderProvider>
      </CartProvider>
    </GlobalProvider>
  );
}
