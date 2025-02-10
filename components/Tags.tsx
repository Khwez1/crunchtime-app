import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Tags({ onTagSelect, selectedFilter }) {
  const tags = [
    { name: 'Nearby', icon: 'location-outline' },
    { name: 'Offers', icon: 'pricetag-outline' },
    { name: 'Rated', icon: 'star-outline' },
    { name: 'Price', icon: 'cash-outline' },
  ];

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row ml-[8px] mt-1">
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTagSelect(selectedFilter === tag.name ? null : tag.name)} 
            className={`mr-2 p-3 px-5 rounded-3xl flex-row items-center ${
              selectedFilter === tag.name ? 'bg-red-800' : 'bg-red-600'
            }`}
          >
            <Ionicons name={tag.icon} size={18} color="white" className="mr-1" />
            <Text className="text-white text-md font-semibold">{tag.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};