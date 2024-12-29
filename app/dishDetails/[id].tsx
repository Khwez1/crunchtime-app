import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DishHeader from '~/components/DishHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import Counter from '~/components/Counter';
import { getDish } from '~/lib/appwrite';
import { useCartContext } from '~/providers/CartProvider';
import { useGlobalContext } from '~/providers/GlobalProvider'; // Add this import

const DishDetails = () => {
  const { addProduct, carts } = useCartContext(); // Changed from cart to carts
  const { user } = useGlobalContext(); // Add this to get the user
  const [preference, setPreference] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [optionalExtras, setOptionalExtras] = useState([]);
  const [requiredExtras, setRequiredExtras] = useState({}); 
  const [dish, setDish] = useState(null);
  const [error, setError] = useState(null);
  
  const { id } = useLocalSearchParams();
  
  useEffect(() => {
    const fetchDish = async () => {
      try {
        const fetchedDish = await getDish(id);
        setDish(fetchedDish);
        setError(null);
      } catch (error) {
        console.error('Error fetching dish:', error);
        setError('Error fetching dish details');
      }
    };

    fetchDish();
  }, [id]);

  const getTotal = () => {
    const optionalTotal = optionalExtras.reduce((total, extra) => total + extra.price, 0);
    const requiredTotal = Object.values(requiredExtras).reduce((total, extra) => total + extra.price, 0);
    const dishTotal = dish?.price || 0;
    const total = (dishTotal + optionalTotal + requiredTotal) * quantity;
    return total.toFixed(2);
  };

  const handleOptionalExtras = (newExtra) => {
    setOptionalExtras((prevExtras) => {
      const exists = prevExtras.some(
        (extra) => extra.name === newExtra.name
      );
  
      if (exists) {
        return prevExtras.filter(
          (extra) => extra.name !== newExtra.name
        );
      } 
      return [...prevExtras, newExtra];
    });
  };

  const handleRequiredExtras = (option, extraName) => {
    setRequiredExtras(prev => {
      if (prev[extraName]?.name === option.name) {
        const newExtras = { ...prev };
        delete newExtras[extraName];
        return newExtras;
      }
      return {
        ...prev,
        [extraName]: option
      };
    });
  };
  
  const addToCart = async () => {
    try {
      if (!dish) {
        setError("Dish not found!");
        return;
      }
  
      if (!user) {
        setError("Please log in to add items to cart");
        return;
      }
    
      const restaurantId = dish.restaurants?.$id;
      if (!restaurantId) {
        setError("Restaurant ID is missing for this dish.");
        return;
      }
  
      // Check if all required extras are selected
      if (dish.requiredExtras) {
        const missingRequired = dish.requiredExtras.some(extra => !requiredExtras[extra.name]);
        if (missingRequired) {
          setError("Please select all required extras before adding to cart");
          return;
        }
      }
    
      await addProduct(dish, restaurantId, quantity, requiredExtras, optionalExtras);
      
      // Optional: Show success message or navigate to cart
      router.push('/carts');
    } catch (error) {
      setError(error.message || "Error adding to cart");
      console.error("Error adding to cart:", error);
    }
  };
  
  if (!dish) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error || "Loading..."}</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex'>
      <DishHeader Dish={dish} />
      <View className='m-[10px]'>
        {error && (
          <View className="bg-red-100 p-3 mb-4 rounded">
            <Text className="text-red-600">{error}</Text>
          </View>
        )}

        {dish.requiredExtras && (
          <>
            <Text className='text-[22px] mb-[10px] font-medium'>Required Extras</Text>
            {dish.requiredExtras.map((extra, index) => (
              <View key={index} className='flex-col justify-between mb-[10px]'>
                <Text className='mb-[10px]'>{extra.name}</Text>
                {extra.options.map((option, idx) => (
                  <View key={idx} className='flex-row justify-between'>
                    <BouncyCheckbox
                      size={20}
                      unfillColor='#FFFFFF'
                      fillColor='#DC2626'
                      innerIconStyle={{ borderWidth: 1 }}
                      text={option.name}
                      isChecked={requiredExtras[extra.name]?.name === option.name}
                      onPress={() => handleRequiredExtras(option, extra.name)}
                      disabled={requiredExtras[extra.name] && requiredExtras[extra.name].name !== option.name}
                      disableBuiltInState
                    />
                    <Text className='text-black mt-[5px] '>$ {option.price}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {dish.optionalExtras && (
          <>
            <Text className='text-[22px] font-medium mb-[10px] mt-[20px]'>Optional Extras</Text>
            {dish.optionalExtras.map((extra, index) => (
              <View key={index} className='flex-col justify-between mb-[10px]'>
                <Text className='mb-[10px]'>{extra.name}</Text>
                {extra.options.map((option, idx) => (
                  <View key={idx} className='flex-row justify-between'>
                    <BouncyCheckbox
                      size={20}
                      unfillColor='#FFFFFF'
                      fillColor='#DC2626'
                      innerIconStyle={{ borderWidth: 1 }}
                      text={option.name}
                      isChecked={optionalExtras.some(extra => extra.name === option.name)}
                      onPress={() => handleOptionalExtras(option)}
                    />
                    <Text className='text-black mt-[5px]'>$ {option.price}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        <Text className='text-[35px] mb-[10px] mt-[20px]'>Preferences</Text>

        <View className='flex-row border-2 h-[50px] rounded-[8px] px-[12px] items-center'>
          <TextInput 
            placeholder='Add specific instructions'
            value={preference}
            onChangeText={(value) => setPreference(value)}
            autoCapitalize='none'
            autoCorrect={false}
            className='flex-1'
          />
        </View>

        <View className='flex-row justify-between mt-[20px] mb-1'>
          <Text className='mb-[10px]'>
            Quantity
          </Text>
          <Counter quantity={quantity} setQuantity={setQuantity} />
        </View>

        <TouchableOpacity 
          onPress={addToCart} 
          className='flex-1 rounded-xl bg-red-600 mt-auto p-[20px] items-center'
        >
          <Text className='text-white font-bold text-[20px]'>
            Add {quantity} Items to basket (${getTotal()})
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default DishDetails;