import { createContext, useContext, useEffect, useState } from 'react';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { ID, databases, Query, fetchProfile, client } from '../lib/appwrite';

const OrderContext = createContext({});
export const useOrderContext = () => useContext(OrderContext);

const OrderProvider = ({ children }) => {
  const { user } = useGlobalContext();
  const [activeOrder, setActiveOrder] = useState(null);
  const [driver, setDriver] = useState(null)

  useEffect(() => {
    if (!user) return;

    const fetchActiveOrder = async () => {
      try {
          const res = await databases.listDocuments(
            '669a5a3d003d47ff98c7', // Database ID
            '6731ec1a001ab4994c0c', // Order collection ID
            [
              Query.equal('userId', user.$id),
              Query.notEqual('orderStatus', 'CANCELED'),
              Query.notEqual('orderStatus', 'COMPLETED'),
            ]
          );

          if (res.documents.length > 0) {
            const rawOrder = res.documents[0];
            // Parse JSON fields
            const parsedOrder = {
              ...rawOrder,
              items: JSON.parse(rawOrder.items),
              restaurant: Array.isArray(rawOrder.restaurant)
              ? rawOrder.restaurant
              : JSON.parse(rawOrder.restaurant),
              user: typeof rawOrder.user === 'string'
              ? JSON.parse(rawOrder.user)
              : rawOrder.user,
            };

            console.log("Parsed active order:", parsedOrder);
            setActiveOrder(parsedOrder);
            } else {
            console.log("No active orders found");
            setActiveOrder(null);
          }
        } catch (error) {
          console.error("Error fetching active order:", error);
        }
    };

    fetchActiveOrder();
}, [user]);

  // Fetch driver details for the active order
  useEffect(() => {
    if (!activeOrder?.driverId) return;
  
    const fetchDriver = async () => {
      try {
        const response = await databases.listDocuments(
          '669a5a3d003d47ff98c7', // Database ID
          '66bc885a002d237e96b9', // Driver collection ID
          [Query.equal('driverId', activeOrder.driverId)] // Query to match driverId
        );
  
        if (response.documents.length > 0) {
          setDriver(response.documents[0]); // Set the first matching driver document
        } else {
          console.warn('No driver found with the specified driverId.');
          setDriver(null);
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
      }
    };
  
    fetchDriver();
  }, [activeOrder]);  

  // Subscribe to updates for the active order and driver
  useEffect(() => {
    if (!activeOrder) return;

    const unsubscribe = client.subscribe(
      `databases.${'669a5a3d003d47ff98c7'}.collections.${'6731ec1a001ab4994c0c'}.documents`,
      (response) => {
        if (
          response.events.includes(
            `databases.*.collections.*.documents.${activeOrder.$id}.update`
          )
        ) {
          setActiveOrder(response.payload);
        }
      }
    );

    return () => unsubscribe();
  }, [activeOrder]);

  useEffect(() => {
    if (!driver) return;

    const unsubscribe = client.subscribe(
      `databases.${'669a5a3d003d47ff98c7'}.collections.${'66bc885a002d237e96b9'}.documents`,
      (response) => {
        if (
          response.events.includes(
            `databases.*.collections.*.documents.${driver.$id}.update`
          )
        ) {
          setDriver(response.payload);
        }
      }
    );

    return () => unsubscribe();
  }, [driver]);

    const createOrder = async (restaurant, cartItems, total, cartId) => {
      console.log('createOrder function called'); // Log to verify function is called
      console.log('Restaurant:', restaurant);
      console.log('Cart Items:', cartItems);
      console.log('Total:', total);
      console.log(user);
      
      try {
        if (!user || !user.$id) {
          console.log('User is not available yet');
          return; // Exit if user is not initialized
        }
      
        // Only include necessary fields from the user object
          
        const newOrder = await databases.createDocument(
          '669a5a3d003d47ff98c7', // Replace with your actual database ID
          '6731ec1a001ab4994c0c', // Replace with your actual collection ID
          ID.unique(),
          {
            user: JSON.stringify( await fetchProfile(user.$id)), // Stringify only necessary user data
            userId: user.$id,
            restaurant: JSON.stringify(restaurant),
            orderStatus: 'NEW',
            items: JSON.stringify(cartItems), // Ensure cart items are serialized properly
            total: total,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      
        console.log('Order created successfully:', newOrder);
      
        // Delete cart
        await databases.deleteDocument(
          '669a5a3d003d47ff98c7', // Replace with your actual database ID
          '6731d6a50011b3248698', // Replace with your actual collection ID
          cartId
        );
            
        setActiveOrder(newOrder);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };

  return (
    <OrderContext.Provider
      value={{
        createOrder,
        activeOrder,
        driver
      }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;