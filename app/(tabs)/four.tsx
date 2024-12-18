import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function Profile() {
  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with user's profile picture
        style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
      />
      <Text className="text-2xl font-bold">John Doe</Text>
      <Text className="text-gray-600 mb-4">john.doe@example.com</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#007BFF',
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
        }}
      >
        <Text style={{ color: 'white' }}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
