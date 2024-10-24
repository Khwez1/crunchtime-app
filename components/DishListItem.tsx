import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const DishListItem = ({ dish }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className='flex-row mx-[20px] my-[10px] py-[10px] border-b-[1px] border-gray-400'>
      <View className='flex-1'>
        <Text className='font-bold text-[17px]'>{dish.name}</Text>
        
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text 
            className='text-gray-400 my-[5px]' 
            numberOfLines={isExpanded ? 1 : 3} // Show full or truncated text
          >
            {dish.description}
          </Text>
        </TouchableOpacity>

        <Text className='text-[16px]'>$ {dish.price}</Text>
      </View>
      
      {dish.image && (
        <Image source={{ uri: dish.image }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 75,
    aspectRatio: 1
  }
});

export default DishListItem;
