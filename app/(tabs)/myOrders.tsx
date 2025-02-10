import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getOrdersHistory } from '~/lib/appwrite'; // Adjust the path as needed
import { useGlobalContext } from '~/providers/GlobalProvider';

export default function History() {
  const [orders, setOrders] = useState([]);
  const { user } = useGlobalContext();

  // Fetch orders on mount
  useEffect(() => {
    async function fetchOrders() {
      const fetchedOrders = await getOrdersHistory(user?.$id);
      setOrders(fetchedOrders);
    }
    fetchOrders();
  }, []);

  // Render each card
  const renderOrderCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {/* Restaurant Name */}
      <Text style={styles.restaurantName}>{item.restaurant.name}</Text>

      {/* Order Details */}
      <Text style={styles.orderDetails}>
        Order ID: {item.$id} - {item.orderStatus}
      </Text>
      <Text style={styles.orderDetails}>Date: {new Date(item.$createdAt).toLocaleDateString()}</Text>

      {/* User Details */}
      <Text style={styles.orderDetails}>Customer: {item.user.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>History</Text>

      {/* List of Orders */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.$id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No completed or cancelled orders yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
