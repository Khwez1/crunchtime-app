import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import restaurants from '~/data/restaurants.json';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DishHeader from '~/components/DishHeader';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import Counter from '~/components/Counter';

const DishDetails = () => {
  const [preference, setPreference] = useState('');
  const [count, setCount] = useState(1);
  const [optionalExtras, setOptionalExtras] = useState([]);
  const [requiredExtras, setRequiredExtras] = useState({});  

  const { restaurantId, dishId } = useLocalSearchParams();

  const getTotal = () => {
    const optionalTotal = optionalExtras.reduce((total, extra) => total + extra.price, 0);
    const requiredTotal = Object.values(requiredExtras).reduce((total, extra) => total + extra.price, 0);
    const dishTotal = dish?.price || 0;
    const total = (dishTotal + optionalTotal + requiredTotal) * count;
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
      // If the same option is clicked again, remove it
      if (prev[extraName]?.name === option.name) {
        const newExtras = { ...prev };
        delete newExtras[extraName];
        return newExtras;
      }
      // Otherwise, set the new option
      return {
        ...prev,
        [extraName]: option
      };
    });
  };

  const restaurant = useMemo(() => restaurants.find((o) => o.id === restaurantId), [restaurantId]);
  const dish = useMemo(() => restaurant?.dishes.find((d) => d.id === dishId), [restaurant, dishId]);

  if (!dish) {
    return (
      <View>
        <Text>Dish not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex'>
      <DishHeader Dish={dish} />
      <View className='m-[10px]'>

        {dish.requiredExtras && (
          <>
            <Text className='text-[24px] mb-[10px] mt-[20px]'>Required Extras</Text>
            {dish.requiredExtras.map((extra, index) => (
              <View key={index} className='flex-col justify-between mb-[10px]'>
                <Text>{extra.name}</Text>
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
                    <Text className='text-gray-500'>$ {option.price}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {dish.optionalExtras && (
          <>
            <Text className='text-[24px] mb-[10px] mt-[20px]'>Optional Extras</Text>
            {dish.optionalExtras.map((extra, index) => (
              <View key={index} className='flex-col justify-between mb-[10px]'>
                <Text>{extra.name}</Text>
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
                    <Text className='text-gray-500'>$ {option.price}</Text>
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
          <Counter count={count} setCount={setCount} />
        </View>

        <View className='flex-1 bg-black mt-auto p-[20px] items-center'>
          <Text className='text-white font-bold text-[20px]'>
            Add {count} Items to basket (${getTotal()})
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

export default DishDetails;