import { View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
  StyleSheet,} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { updateProfile, uploadPhoto } from '../../lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';


export default function Profile() {
  const { user, profile, setProfile, fetchUserProfile, signOut, deleteUser } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Camera-related state
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user && user.$id) {
        try {
          setLoading(true);
          await fetchUserProfile(user.$id);
          setNewUsername(profile?.username || '');
          setNewEmail(profile?.email || '');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const updatedData = { username: newUsername, email: newEmail };
      const response = await updateProfile(profile.$id, updatedData);
      setProfile(response);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    if (permission?.granted) {
      setIsCameraVisible(true);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        // Capture the photo using the camera reference
        const photo = await cameraRef.takePictureAsync();
        console.log('Photo taken:', photo);

        // Hide the camera after the photo is taken
        setIsCameraVisible(false);

        // Upload the photo to Appwrite storage
        const uploadedFile = await uploadPhoto(photo.uri);

        // Construct the file URL for the uploaded file
        const newPfp = `https://cloud.appwrite.io/v1/storage/buckets/669e0b5000145d872e7c/files/${uploadedFile.$id}/view`;

        // Update the profile with the new avatar URL
        await updateProfile(profile.$id, { pfp: newPfp });

        // Update local state with the new profile information
        setProfile({ ...profile, pfp: newPfp });

        // Show success message
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        console.error('Failed to upload photo:', error);
        Alert.alert('Error', 'Failed to upload photo.');
      }
    }
  };

  const closeCamera = () => {
    setIsCameraVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user || !profile) {
    return (
      <SafeAreaView>
        <ScrollView>
          <Text>Please log in to view your profile</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Image
            source={{
              uri: profile.pfp
                ? `${profile.pfp}?project=66bb50ba003a365f917d&mode=admin`
                : `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(profile.username)}&project=66694f2c003d7561352e`,
            }}
            style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            👋Welcome! {profile.username}
          </Text>

          {editMode ? (
            <View style={{ marginBottom: 16 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="New username"
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="New email"
              />

              <TouchableOpacity
                style={{
                  backgroundColor: '#4CAF50',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={handleUpdateProfile}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}
                onPress={() => setEditMode(false)}>
                <Text style={{ textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginBottom: 16 }}
              onPress={() => setEditMode(true)}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Username:</Text>
            <Text>{profile.username}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Email:</Text>
            <Text>{profile.email}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>phone:</Text>
            <Text>{profile.phone}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Driver ID:</Text>
            <Text>{profile.userId}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Pfp:</Text>
            <Text>{profile.pfp}</Text>
          </View>

          {/* Button to log Out */}
          <TouchableOpacity
            style={{ backgroundColor: '#f44336', padding: 16, borderRadius: 8, marginTop: 16 }}
            onPress={() => signOut()}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Log Out</Text>
          </TouchableOpacity>

          {/* Button to DeleteUser */}
          <TouchableOpacity
            style={{ backgroundColor: '#f44336', padding: 16, borderRadius: 8, marginTop: 16 }}
            onPress={() => deleteUser(user.$id)}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              Delete User
            </Text>
          </TouchableOpacity>

          {/* Button to open camera */}
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
              alignItems: 'center',
            }}
            onPress={openCamera}>
            <Text style={{ color: '#fff' }}>Open Camera</Text>
          </TouchableOpacity>

          {/* Camera View */}
          {isCameraVisible && (
            <View style={{ marginTop: 20 }}>
              <CameraView
                style={{ width: '100%', height: 300 }}
                facing={facing}
                ref={(ref) => setCameraRef(ref)}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                    <Text style={styles.text}>Take Picture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cameraButton} onPress={closeCamera}>
                    <Text style={styles.text}>Close Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
                    <Text style={styles.text}>Flip Camera</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  // const postDishData = async (dishData) => {
  //   // Endpoint and headers
  //   const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/672b60f200023ce98be2/documents";
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "X-Appwrite-Project": "66bb50ba003a365f917d",
  //   };
    
  //   // Prepare the data by stringifying `requiredExtras` and `optionalExtras` if they exist
  //   const dataToPost = {
  //     ...dishData,
  //     requiredExtras: dishData.requiredExtras ? JSON.stringify(dishData.requiredExtras) : '',
  //     optionalExtras: dishData.optionalExtras ? JSON.stringify(dishData.optionalExtras) : '',
  //   };
  
  //   console.log('URL:', url);
  //   console.log('Headers:', headers);
  //   console.log('Data to post:', dataToPost);
  
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify({
  //         documentId: "unique()", // auto-generate a unique document ID
  //         data: dataToPost,
  //       }),
  //     });
    
  //     if (!response.ok) {
  //       console.error('Response error:', response);
  //       throw new Error(`Error: ${response.statusText}`);
  //     }
    
  //     const result = await response.json();
  //     console.log("Document posted successfully:", result);
  //     return result;
  //   } catch (error) {
  //     console.error("Error posting document:", error);
  //     throw error;
  //   }
  // };
    
  // // Example usage
  // const exampleDish = {
  //   "name": "Carolina Honey",
  //   "description": "Our famous ribs marinated with our Carolina honey sauce, a mixture of honey with our original sauce. Ideal for those looking for a sweet touch. Served with French fries and coleslaw.",
  //   "price": 18.95,
  //   "restaurants":"6737676f0018ef9d2331",
  //   "image": "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/uber-eats/restaurant2.jpeg",
  //   "requiredExtras": [
  //     {
  //       "name": "Honey Sauce Level",
  //       "options": [
  //         { "name": "Light", "price": 0 },
  //         { "name": "Medium", "price": 0 },
  //         { "name": "Extra", "price": 1.0 }
  //       ]
  //     }
  //   ],
  //   "optionalExtras": [
  //     {
  //       "name": "Add-on Meat",
  //       "options": [
  //         { "name": "Extra Ribs", "price": 4.5 },
  //         { "name": "Grilled Chicken", "price": 3.5 }
  //       ]
  //     }
  //   ]
  // }
        
  // Run the function with example data
  // postDishData(exampleDish);
  
  // const postDishData = async () => {
  //   const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/6731d6a50011b3248698/documents";
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "X-Appwrite-Project": "66bb50ba003a365f917d",
  //   };
    
  //   const cartData = {
  //     userId: "673aef590019fa7c1739",
  //     restaurantId: "6737676f0018ef9d2331",
  //     cartItems: JSON.stringify([
  //       {
  //         "dishId": "67376aed18caaa66c1df",
  //         "name": "Dish Name",
  //         "price": 18.95,
  //         "quantity": 1,
  //         "totalPrice": 18.95,
  //         "requiredExtras": [],
  //         "optionalExtras": [],
  //       },
  //     ]),
  //   };
    
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify({
  //         documentId: "unique()",
  //         data: cartData,
  //       }),
  //     });
    
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error(`Error adding product to cart: ${response.status} - ${errorText}`);
  //       throw new Error(`Error: ${response.statusText}`);
  //     }
    
  //     const result = await response.json();
  //     console.log("Cart updated successfully:", result);
  //     return result;
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error);
  //     throw error;
  //   };
  // }
  // postDishData();

//   const postOrderData = async () => {
//   const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/6731ec1a001ab4994c0c/documents";
//   const headers = {
//     "Content-Type": "application/json",
//     "X-Appwrite-Project": "66bb50ba003a365f917d",
//   };

//   const orderData = {
//     orderStatus: "NEW",
//     createdAt: "2022-04-16T18:56:49.713Z",
//     updatedAt: "2022-04-16T18:56:49.713Z",
//     restaurant: JSON.stringify({
//       id: "7d7965f7-1b33-4b8c-9bac-0c22bc905030",
//       name: "Jacobs",
//       image: "https://cdn-images.imagevenue.com/f8/26/8d/ME197LJA_o.jpg",
//       deliveryFee: 0.039448871531492236,
//       minDeliveryTime: 10,
//       maxDeliveryTime: 44,
//       rating: 1.5095123177204128,
//       address: "983 Lewis Rapids",
//       lat: -33.9050,
//       lng: 18.4830,
//       createdAt: "2022-04-16T12:03:33.225Z",
//       updatedAt: "2022-04-16T12:05:12.826Z"
//     }),
//     items: JSON.stringify([
//       {
//         dishId: "67376aed18caaa66c1df",
//         name: "Dish Name",
//         price: 18.95,
//         quantity: 1,
//         totalPrice: 18.95,
//         requiredExtras: [],
//         optionalExtras: [],
//       },
//     ]),
//     user: JSON.stringify({
//       id: "3",
//       name: "Alex",
//       address: "Happy land",
//       lat: -33.9030,
//       lng: 18.4818
//     }),
//     userId: "9b09b087-cf40-41f4-a375-8dc75843a8d1",
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify({
//         documentId: "unique()",
//         data: orderData,
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`Error adding order: ${response.status} - ${errorText}`);
//       throw new Error(`Error: ${response.statusText}`);
//     }

//     const result = await response.json();
//     console.log("Order posted successfully:", result);
//     return result;
//   } catch (error) {
//     console.error("Error posting order:", error);
//     throw error;
//   }
// };

// // postOrderData();


//   return (
//     <>
//       <Stack.Screen options={{ title: 'Tab Two' }} />
//       <View style={styles.container}>
//       </View>
//     </>
//   );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  cameraButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
