import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '~/components/CustomHeader';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarLabelStyle: { fontSize: 12 }, // Font size for labels
        // header: () => <CustomHeader />,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="one" // Home screen
        options={{
          title: 'Home', // Tab label
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="two" // Search screen
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Orders Tab */}
      <Tabs.Screen
        name="three" // Orders screen
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="four" // Profile screen
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
