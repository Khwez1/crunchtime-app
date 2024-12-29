import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryTags() {
  const categories = [
    { name: 'Pizza', icon: 'pizza-outline' },
    { name: 'Burgers', icon: 'fast-food-outline' },
    { name: 'Salads', icon: 'leaf-outline' },
    { name: 'Sushi', icon: 'fish-outline' },
    { name: 'Pizza', icon: 'pizza-outline' },
    { name: 'Burgers', icon: 'fast-food-outline' },
    { name: 'Salads', icon: 'leaf-outline' },
    { name: 'Sushi', icon: 'fish-outline' },
  ];

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row ml-[8px] my-4">
        {categories.map((category, index) => (
          <View key={index} className="mr-4 items-center">
            <View className="bg-yellow-400 p-3 rounded-full">
                <Ionicons name={category.icon} size={30} color="black" />
            </View>
            <Text className="mt-2 text-center">{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}