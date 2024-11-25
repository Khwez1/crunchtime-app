import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { account, ID, databases, functions, Query } from '../lib/appwrite';
import { useCartContext } from '~/providers/CartProvider';

const OrderContext = createContext({});
export const useOrderContext = () => useContext(OrderContext);

const OrderProvider = ({ children }) => {
    const { user } = useGlobalContext();
    const { cart } = useCartContext();

    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        const response = databases.listDocuments(
            '669a5a3d003d47ff98c7',
            '6731ec1a001ab4994c0c',
            [
                Query.equal('userId', user)
            ]
        )
        setOrders(response)
    }, [])

    const createOrder = async (restaurant, cartItems, total) => {
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
      
          console.log('User:', user);
      
          // Only include necessary fields from the user object
          
      
          const newOrder = await databases.createDocument(
            '669a5a3d003d47ff98c7', // Replace with your actual database ID
            '6731ec1a001ab4994c0c', // Replace with your actual collection ID
            ID.unique(),
            {
              user: JSON.stringify(user), // Stringify only necessary user data
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
          // await databases.deleteDocument(
          //   '669a5a3d003d47ff98c7', // Replace with your actual database ID
          //   '6731d6a50011b3248698', // Replace with your actual collection ID
          //   cart.$id
          // );
      
          console.log('Cart deleted successfully');
      
          // setOrders((prevOrders) => [...prevOrders, newOrder]);
        } catch (error) {
          console.error('Error creating order:', error);
        }
      };
      
      
      

    const getOrder = async (id: string) => {
        const order = await databases.listDocuments(
            '669a5a3d003d47ff98c7',
            '6731ec1a001ab4994c0c',
            [
                Query.equal('documentId',id)
            ]
        )
        return { ...order }
    };


  return (
    <OrderContext.Provider
      value={{
        createOrder,
        orders,
        getOrder
      }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
