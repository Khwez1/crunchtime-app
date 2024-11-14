import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Two() {
    const postDishData = async (dishData) => {
      // Endpoint and headers
      const url = "https://cloud.appwrite.io/v1/databases/669a5a3d003d47ff98c7/collections/672b60f200023ce98be2/documents";
      const headers = {
        "Content-Type": "application/json",
        "X-Appwrite-Project": "66bb50ba003a365f917d",
      };
    
      // Prepare the data by stringifying `requiredExtras` and `optionalExtras` if they exist
      const dataToPost = {
        ...dishData,
        requiredExtras: dishData.requiredExtras ? JSON.stringify(dishData.requiredExtras) : '',
        optionalExtras: dishData.optionalExtras ? JSON.stringify(dishData.optionalExtras) : '',
      };
  
      console.log('URL:', url);
      console.log('Headers:', headers);
      console.log('Data to post:', dataToPost);
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            documentId: "unique()", // auto-generate a unique document ID
            data: dataToPost,
          }),
        });
    
        if (!response.ok) {
          console.error('Response error:', response);
          throw new Error(`Error: ${response.statusText}`);
        }
    
        const result = await response.json();
        console.log("Document posted successfully:", result);
        return result;
      } catch (error) {
        console.error("Error posting document:", error);
        throw error;
      }
    };
    
    // Example usage
    const exampleDish = {
      "name": "Alabama Bread",
        "description": "Artisan bread, butter sauce, garlic, BBQ chicken and cheddar.",
        "price": 3.0,
        "restaurants":"672c629c353c4f4f6a4a",
        "requiredExtras": [
          
        ],
        "optionalExtras": [
         {
            "name": "Cheese Options",
            "options": [
              { "name": "Extra Cheddar", "price": 1.0 },
              { "name": "Mozzarella", "price": 1.0 }
            ]
          }
        ]
    };
    
    // Run the function with example data
    // postDishData(exampleDish);
  
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
