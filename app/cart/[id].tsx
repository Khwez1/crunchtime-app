import { View, Text, FlatList, Pressable, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRestaurant } from '~/lib/appwrite';
import CartDishItem from '~/components/CartDishItem';
import { useEffect, useState, useMemo } from 'react';
import { useCartContext } from '~/providers/CartProvider';
import { router } from 'expo-router';

const Cart = () => {
  const { id } = useLocalSearchParams(); // id is the restaurantId
  const [restaurant, setRestaurant] = useState(null);
  const { carts, loading, error, updateCartItemQuantity, removeFromCart } = useCartContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Find the specific cart for this restaurant
  const currentCart = useMemo(() => {
    return carts.find((cart) => cart.restaurantId === id);
  }, [carts, id]);

  // Parse cart items
  const cartItems = useMemo(() => {
    if (!currentCart) return [];
    try {
      return JSON.parse(currentCart.cartItems);
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  }, [currentCart]);

  // Calculate total
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
  }, [cartItems]);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantData = await getRestaurant(id);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Function to show modal when quantity is 1
  const showRemoveModal = (item) => {
    setItemToRemove(item);
    setModalVisible(true);
  };

  // Function to hide modal
  const hideModal = () => {
    setModalVisible(false);
    setItemToRemove(null);
  };

  // Function to remove item from cart
  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(id, itemToRemove.dishId);
      hideModal();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentCart) {
    return (
      <View style={styles.center}>
        <Text>No items in cart for this restaurant</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingBorder}>
          <Text style={styles.title}>{restaurant?.name || "Your Cart"}</Text>
        </View>
        <View style={styles.headingBorder}>
          <Text style={styles.subtitle}>Your Items</Text>
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => `${item.dishId}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.itemBorder}>
            <CartDishItem 
              cartDish={item} 
              restaurantId={id} 
              onDecrease={showRemoveModal} 
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in cart</Text>
        }
        contentContainerStyle={styles.flatListContent}
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.totalText}>Total: R{total}</Text>
          <Pressable
            style={styles.checkoutButton}
            onPress={() =>
              router.push({
                pathname: "/checkout/[id]",
                params: { id: currentCart.restaurantId },
              })
            }
          >
            <Text style={styles.checkoutText}>Go to Checkout</Text>
          </Pressable>
        </View>
      )}

      {/* Modal for confirming item removal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
            <Text style={styles.modalText}>Do you want to remove this item from your cart?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={hideModal}>
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonConfirm]} onPress={confirmRemoveItem}>
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
  // Removed borderWidth, borderColor, and borderRadius for headingBorder
  headingBorder: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    // Added textDecorationLine for underline
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "black",
    // Added textDecorationLine for underline
    textDecorationLine: 'underline',
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for footer
  },
  itemBorder: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fcc0c0",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 2,
    borderTopColor: "black",
  },
  divider: {
    height: 2,
    backgroundColor: "black",
    marginVertical: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  checkoutButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonConfirm: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default Cart;