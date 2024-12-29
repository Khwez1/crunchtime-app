import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Tags() {
  const tags = [
    { name: 'Nearby', icon: 'location-outline' },
    { name: 'Offers', icon: 'pricetag-outline' },
    { name: 'Rated', icon: 'star-outline' },
    { name: 'Price', icon: 'cash-outline' },
  ];

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row ml-[8px] mt-2">
        {tags.map((tag, index) => (
          <View key={index} className="bg-red-600 mr-2 p-3 px-5 text-white rounded-3xl font-semibold flex-row items-center">
            <Ionicons name={tag.icon} size={18} color="white" className="mr-1" />
            <Text className="text-white text-md font-semibold">{tag.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}