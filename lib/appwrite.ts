import {
  Client,
  Avatars,
  Databases,
  Account,
  ID,
  Query,
  Storage,
  Functions
} from "react-native-appwrite";

const client = new Client();
const databases = new Databases(client);
const avatars = new Avatars(client);
const account = new Account(client);
const storage = new Storage(client);
const functions = new Functions(client);

export { account, functions, storage, databases, avatars, client, ID, Query };

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66bb50ba003a365f917d")

export async function getRestaurants(lng: any, lat: any) {
  try {
    const response = await functions.createExecution('66f56c0900179863a190', JSON.stringify({ lng, lat }));

    // Parse the responseBody from the serverless function (it comes as a JSON string)
    const { success, sortedRestaurants } = JSON.parse(response.responseBody);

    // Log the parsed data
    console.log('Success:', success);
    console.log('Sorted Restaurants:', JSON.stringify(sortedRestaurants, null, 3));

    // You can return the sortedRestaurants if you need it in the client code
    return sortedRestaurants;
  } catch (error) {
    console.error('Failed to fetch Restaurants:', error);
    throw error;
  }
};

export async function getRestaurant(id: string) {
  try {
    let res = await databases.listDocuments(
      "669a5a3d003d47ff98c7",
      "672b2eec001fae2377d9",
      [
        Query.equal('$id', id)
      ]
    );
    return res.documents;
  } catch (error) {
    console.error('Failed to fetch Restaurant:', error);
    throw error;
  }
}

export async function getDishes(id: string) {
  try {
    let res = await databases.listDocuments(
      "669a5a3d003d47ff98c7",
      "672b60f200023ce98be2",
      [
        Query.equal("restaurants", id)
      ]
    );
    return res.documents;
  } catch (error) {
    console.error('Failed to fetch Dishes:', error);
    throw error;
  }
}

export async function getDish(id) {
  try {
    let res = await databases.listDocuments(
      "669a5a3d003d47ff98c7",
      "672b60f200023ce98be2",
      [
        Query.equal('$id', id)
      ]
    );
    // console.log('RESPONSE:', res);
    const data = res.documents;

    // Ensure that requiredExtras and optionalExtras are parsed if they exist
    if (data.length > 0) {
      const dish = data[0]; // Only need the first item as a single object

      dish.requiredExtras = dish.requiredExtras
        ? JSON.parse(dish.requiredExtras)
        : []; // Default to an empty array if undefined

      dish.optionalExtras = dish.optionalExtras
        ? JSON.parse(dish.optionalExtras)
        : []; // Default to an empty array if undefined

      return dish; // Return the single dish object directly
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch Dish:', error);
    throw error;
  }
}

export async function updateProfile(documentId: string, updatedData: object) {
  try {
    const response = await databases.updateDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '669a5a7f000cea3cde9d', // Collection ID, users
      documentId, // Use the document.$id
      updatedData
    );
    console.log('User profile updated successfully');
    return response;
  } catch (error) {
    console.log('Failed to update user info', error);
    throw error;
  }
}

export async function fetchProfile(user_id: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '669a5a7f000cea3cde9d', // Collection ID, users
      [Query.equal('userId', user_id)]
    );
    console.log(response.documents);
    if (response.documents.length > 0) {
      console.log('User document retrieved:', response.documents[0]);
      return response.documents[0];
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.log('Error fetching user info:', error.message);
    throw error;
  }
}

export async function uploadPhoto(photoUri: string) {
  try {
    // Log the URI to check if it's valid
    console.log('Processed Photo URI:', photoUri);

    // Create a FormData object to upload the file
    const formData = new FormData();

    // Append the file to the FormData with the correct fileId and file attributes
    formData.append('fileId', ID.unique()); // Generate a unique fileId
    formData.append('file', {
      uri: photoUri,
      name: `photo_${Date.now()}.jpg`, // Set a unique name
      type: 'image/jpeg', // Set the MIME type
    });

    // Perform the file upload to Appwrite
    const response = await fetch(
      'https://cloud.appwrite.io/v1/storage/buckets/669e0b5000145d872e7c/files',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Appwrite-Project': '66bb50ba003a365f917d', // Replace with your Appwrite project ID
        },
        body: formData,
      }
    );

    // Check if response is successful
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to upload file: ${errorResponse.message}`);
    }

    // Parse the response JSON if the file upload is successful
    const file = await response.json();
    console.log('Uploaded File:', file);

    return file;
  } catch (error) {
    console.error('Failed to upload photo:', error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
};

export async function updateCartItemsInDatabase(cartId: string, cartItems: any[]) {
  try {
    const response = await databases.updateDocument(
      '669a5a3d003d47ff98c7',
      '6731d6a50011b3248698',
      cartId,
      {
        cartItems: JSON.stringify(cartItems)
      }
    );
    console.log('Updated cart item quantity:', response);
    return response;
  } catch (error) {
    console.error('Failed to update cart item quantity:', error);
    throw error;
  }
};

export async function searchRestaurants(query: string) {
  try {
    const foundRestaurants = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '672b2eec001fae2377d9', // restuarants collection
      [
        Query.search('name', query)
      ]
    );
    return foundRestaurants.documents;
  } catch (err) {
    throw new Error(err);
  }
};

//messaging
// Send message
export async function sendMessage(payload: object, Permissions: []) {
  try {
    await databases.createDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '677d5197000b1aefb3d0', // Collection ID, messages
      ID.unique(),
      payload,
      Permissions
    );
  } catch (err) {
    console.log("Error! Couldn't send", err);
  }
}

// Get messages
export async function getMessages(activeOrderId: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '677d5197000b1aefb3d0', // Collection ID, messages
      [
        Query.orderDesc('$createdAt'),
        Query.equal('orderId', activeOrderId)
      ]
    );
    console.log('RESPONSE:', response);
    return response.documents;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
}

//Delete message
export async function deleteMessage(message_id: string) {
  try {
    await databases.deleteDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '677d5197000b1aefb3d0', // Collection ID, messages
      message_id
    );
  } catch (err) {
    console.log("Couldn't delete");
  }
};

export async function fetchUserCards(userId: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '67877db7003794586639', // Correct Collection ID for cards
      [Query.equal('userId', userId)]
    );
    console.log('User cards retrieved:', response.documents);
    return response.documents;
  } catch (error) {
    console.error('Error fetching user cards:', error.message);
    throw error;
  }
};

export async function saveCardAuthorization(userId, authorizationCode, maskedNumber, cardType) {
  try {
    const response = await databases.createDocument(
      '669a5a3d003d47ff98c7', // Replace with your Appwrite database ID
      '67877db7003794586639', // Replace with your Appwrite collection ID for cards
      ID.unique(), // Generates a unique document ID
      {
        userId: userId,
        authorizationCode: authorizationCode,
        maskedNumber: maskedNumber,
        cardType: cardType,
      }
    );
    console.log('Card authorization saved:', response);
    return response;
  } catch (error) {
    console.error('Error saving card authorization:', error);
    throw error;
  }
};

// Then, in your saveCardFromPaystackResponse function:
export async function saveCardFromPaystackResponse(paystackResponse, userId) {
  try {
    const { data } = paystackResponse;

    // Extract and format the card details from Paystack's response
    const { card_type, authorization_code, bin, last4, exp_month, exp_year, channel, bank, brand, reusable } = data;

    // Log for debugging
    console.log('Paystack card type:', card_type);

    const formattedCardType = card_type.toLowerCase().includes("credit") ? "Credit" : "Debit";

    // Validate card type
    if (!['Debit', 'Credit'].includes(formattedCardType)) {
      console.error('Invalid card type:', formattedCardType);
      throw new Error(`Invalid card type: ${formattedCardType}`);
    }

    // Now call the top-level function
    await saveCardAuthorization(
      userId,
      authorization_code,
      `${bin.slice(0, 6)}****${last4}`, // Assuming you want to mask the number like this
      formattedCardType
    );

    // ... any other logic or return statement ...

  } catch (error) {
    // Handle errors
    console.error('Error in saveCardFromPaystackResponse:', error);
    throw error;
  }
};