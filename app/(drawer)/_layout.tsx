import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent  from '~/components/CustomDrawerContent';

export default function DrawerLayout() {

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer
      screenOptions={{
        headerShown: false, gestureEnabled: Platform.OS === 'android' ? false : true, swipeEnabled: false, drawerStyle: {
          backgroundColor: '#ffc700',
          width: 320,
        }
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Define screens and navigation directly here */}
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="carts"
        options={{
          drawerLabel: 'Carts',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="myOrders"
        options={{
          drawerLabel: 'MyOrders',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TnCs"
        options={{
          drawerLabel: 'Terms & Conditions',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  </GestureHandlerRootView>
  );
}
