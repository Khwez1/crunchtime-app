import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const DishListItem = ({ dish, restaurantId }) => {
  return (
    <Pressable 
      className='flex-row mx-[20px] my-[10px] py-[10px] border-b-[1px] border-gray-400' 
      onPress={() => router.push({
        pathname: `/restaurantDetails/dishDetails/${dish.id}`,  // Pass dishId dynamically
        params: { restaurantId }  // Pass restaurantId as a parameter
      })}
    >
      <View className='flex-1'>
        <Text className='font-bold text-[17px]'>{dish.name}</Text>
        
        <Text className='text-gray-400 my-[5px]' numberOfLines={3}>
          {dish.description}
        </Text>

        <Text className='text-[16px]'>$ {dish.price}</Text>
      </View>
      
      {dish.image && (
        <Image source={{ uri: dish.image }} style={styles.image} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 75,
    aspectRatio: 1,
  },
});

export default DishListItem;
