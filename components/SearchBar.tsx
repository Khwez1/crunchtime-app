import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, usePathname } from 'expo-router';

const SearchBar = ({ initialQuery }) => {
    const [query, setQuery] = useState(initialQuery ||''); 
    const pathname = usePathname();
  return (
    <View className="flex-row items-center mt-3 bg-white p-2 rounded-lg shadow-sm">
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert('Please enter a search query')
          }
          if (pathname.startsWith('/search')) { router.setParams({ query }) }
          else router.push(`/search/${query}`)
        }}
      >
        <Ionicons name="search" size={20} color="gray" className="mr-2" />
      </TouchableOpacity>
      <TextInput
        value={query}
        onChangeText={(e) => setQuery(e)}
        placeholder="Search for restaurants"
        className="flex-1 text-sm text-gray-500"
      />
    </View>
  )
}

export default SearchBar;