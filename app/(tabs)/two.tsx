import { Stack } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';


export default function Two() {
  // const postDishData = async (dishData) => {
  //   // Endpoint and headers
  //   const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/672b60f200023ce98be2/documents";
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "X-Appwrite-Project": "66bb50ba003a365f917d",
  //   };
    
  //   // Prepare the data by stringifying `requiredExtras` and `optionalExtras` if they exist
  //   const dataToPost = {
  //     ...dishData,
  //     requiredExtras: dishData.requiredExtras ? JSON.stringify(dishData.requiredExtras) : '',
  //     optionalExtras: dishData.optionalExtras ? JSON.stringify(dishData.optionalExtras) : '',
  //   };
  
  //   console.log('URL:', url);
  //   console.log('Headers:', headers);
  //   console.log('Data to post:', dataToPost);
  
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify({
  //         documentId: "unique()", // auto-generate a unique document ID
  //         data: dataToPost,
  //       }),
  //     });
    
  //     if (!response.ok) {
  //       console.error('Response error:', response);
  //       throw new Error(`Error: ${response.statusText}`);
  //     }
    
  //     const result = await response.json();
  //     console.log("Document posted successfully:", result);
  //     return result;
  //   } catch (error) {
  //     console.error("Error posting document:", error);
  //     throw error;
  //   }
  // };
    
  // // Example usage
  // const exampleDish = {
  //   "name": "Carolina Honey",
  //   "description": "Our famous ribs marinated with our Carolina honey sauce, a mixture of honey with our original sauce. Ideal for those looking for a sweet touch. Served with French fries and coleslaw.",
  //   "price": 18.95,
  //   "restaurants":"6737676f0018ef9d2331",
  //   "image": "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/uber-eats/restaurant2.jpeg",
  //   "requiredExtras": [
  //     {
  //       "name": "Honey Sauce Level",
  //       "options": [
  //         { "name": "Light", "price": 0 },
  //         { "name": "Medium", "price": 0 },
  //         { "name": "Extra", "price": 1.0 }
  //       ]
  //     }
  //   ],
  //   "optionalExtras": [
  //     {
  //       "name": "Add-on Meat",
  //       "options": [
  //         { "name": "Extra Ribs", "price": 4.5 },
  //         { "name": "Grilled Chicken", "price": 3.5 }
  //       ]
  //     }
  //   ]
  // }
        
  // Run the function with example data
  // postDishData(exampleDish);
  
  // const postDishData = async () => {
  //   const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/6731d6a50011b3248698/documents";
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "X-Appwrite-Project": "66bb50ba003a365f917d",
  //   };
    
  //   const cartData = {
  //     userId: "673aef590019fa7c1739",
  //     restaurantId: "6737676f0018ef9d2331",
  //     cartItems: JSON.stringify([
  //       {
  //         "dishId": "67376aed18caaa66c1df",
  //         "name": "Dish Name",
  //         "price": 18.95,
  //         "quantity": 1,
  //         "totalPrice": 18.95,
  //         "requiredExtras": [],
  //         "optionalExtras": [],
  //       },
  //     ]),
  //   };
    
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify({
  //         documentId: "unique()",
  //         data: cartData,
  //       }),
  //     });
    
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error(`Error adding product to cart: ${response.status} - ${errorText}`);
  //       throw new Error(`Error: ${response.statusText}`);
  //     }
    
  //     const result = await response.json();
  //     console.log("Cart updated successfully:", result);
  //     return result;
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error);
  //     throw error;
  //   };
  // }
  // postDishData();

  const postOrderData = async () => {
  const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/6731ec1a001ab4994c0c/documents";
  const headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": "66bb50ba003a365f917d",
  };

  const orderData = {
    orderStatus: "NEW",
    createdAt: "2022-04-16T18:56:49.713Z",
    updatedAt: "2022-04-16T18:56:49.713Z",
    restaurant: JSON.stringify({
      id: "7d7965f7-1b33-4b8c-9bac-0c22bc905030",
      name: "Jacobs",
      image: "https://cdn-images.imagevenue.com/f8/26/8d/ME197LJA_o.jpg",
      deliveryFee: 0.039448871531492236,
      minDeliveryTime: 10,
      maxDeliveryTime: 44,
      rating: 1.5095123177204128,
      address: "983 Lewis Rapids",
      lat: -33.9050,
      lng: 18.4830,
      createdAt: "2022-04-16T12:03:33.225Z",
      updatedAt: "2022-04-16T12:05:12.826Z"
    }),
    items: JSON.stringify([
      {
        dishId: "67376aed18caaa66c1df",
        name: "Dish Name",
        price: 18.95,
        quantity: 1,
        totalPrice: 18.95,
        requiredExtras: [],
        optionalExtras: [],
      },
    ]),
    user: JSON.stringify({
      id: "3",
      name: "Alex",
      address: "Happy land",
      lat: -33.9030,
      lng: 18.4818
    }),
    userId: "9b09b087-cf40-41f4-a375-8dc75843a8d1",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        documentId: "unique()",
        data: orderData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error adding order: ${response.status} - ${errorText}`);
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Order posted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error posting order:", error);
    throw error;
  }
};

// postOrderData();


  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
