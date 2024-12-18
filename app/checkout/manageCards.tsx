import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, Linking, ActivityIndicator } from "react-native";

// Configuration
const PAYSTACK_SECRET_KEY = "sk_test_your_paystack_secret_key"; // Replace with your Paystack secret key
const APPWRITE_PROJECT_ID = "66bb50ba003a365f917d"; // Replace with your Appwrite Project ID
const APPWRITE_API_KEY = "your_appwrite_api_key"; // Replace with your Appwrite API key
const APPWRITE_USERS_COLLECTION_ID = "669a5a7f000cea3cde9d"; // Replace with your Appwrite Cards Collection ID

const ManagePaymentMethods = () => {
  const [cards, setCards] = useState([]); // State for user cards
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = () => {
    // Replace with your actual logic to get logged-in user data
    return {
      id: "USER_ID_HERE", // Replace with logged-in user's ID
      email: "user@example.com", // Replace with logged-in user's email
    };
  };

  const fetchCards = async () => {
    const user = fetchUser();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://cloud.appwrite.io/v1/database/collections/${APPWRITE_USERS_COLLECTION_ID}/documents/${user.id}`,
        {
          method: "GET",
          headers: {
            "X-Appwrite-Project": APPWRITE_PROJECT_ID,
            "X-Appwrite-Key": APPWRITE_API_KEY,
          },
        }
      );

      const userData = await response.json();
      setCards(userData.savedCards || []);
    } catch (error) {
      console.error("Error fetching cards:", error.message);
      Alert.alert("Error", "Unable to fetch saved cards.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCardToAppwrite = async (cardDetails) => {
    const user = fetchUser();
    try {
      const response = await fetch(
        `https://cloud.appwrite.io/v1/database/collections/${APPWRITE_USERS_COLLECTION_ID}/documents/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": APPWRITE_PROJECT_ID,
            "X-Appwrite-Key": APPWRITE_API_KEY,
          },
          body: JSON.stringify({
            savedCards: [...cards, cardDetails],
          }),
        }
      );

      if (response.ok) {
        setCards((prev) => [...prev, cardDetails]);
        Alert.alert("Success", "Card saved successfully!");
      } else {
        throw new Error("Failed to update user document.");
      }
    } catch (error) {
      console.error("Error saving card:", error.message);
      Alert.alert("Error", "Unable to save card. Please try again.");
    }
  };

  const handleAddCard = async () => {
    const user = fetchUser();
    try {
      const initResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email: user.email,
          amount: 100, // Amount in kobo (for card tokenization)
        }),
      });

      const initData = await initResponse.json();
      if (initResponse.ok) {
        const { authorization_url, reference } = initData.data;

        Alert.alert(
          "Redirect to Paystack",
          "You will be redirected to a secure Paystack page to add your card details.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Proceed",
              onPress: async () => {
                await Linking.openURL(authorization_url);

                // Verify the transaction after user adds the card
                const verifyResponse = await fetch(
                  `https://api.paystack.co/transaction/verify/${reference}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                  }
                );

                const verifyData = await verifyResponse.json();
                if (verifyResponse.ok && verifyData.data.status === "success") {
                  const { authorization } = verifyData.data;
                  const cardDetails = {
                    last4: authorization.last4,
                    exp_month: authorization.exp_month,
                    exp_year: authorization.exp_year,
                    authorization_code: authorization.authorization_code,
                  };

                  // Save card details to Appwrite
                  saveCardToAppwrite(cardDetails);
                } else {
                  Alert.alert("Error", "Failed to verify the transaction.");
                }
              },
            },
          ]
        );
      } else {
        throw new Error(initData.message || "Failed to initialize transaction");
      }
    } catch (error) {
      console.error("Error adding card:", error.message);
      Alert.alert("Error", "Unable to add card. Please try again.");
    }
  };

  const handlePayment = async (authorizationCode, amount) => {
    const user = fetchUser();
    setIsLoading(true);
    try {
      const response = await fetch("https://api.paystack.co/transaction/charge_authorization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email: user.email,
          amount: amount * 100, // Convert amount to kobo
          authorization_code: authorizationCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Payment successful!");
      } else {
        Alert.alert("Error", "Payment failed. Please try again.");
        console.error(data);
      }
    } catch (error) {
      console.error("Error processing payment:", error.message);
      Alert.alert("Error", "Unable to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Manage Payment Methods</Text>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={cards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text>**** **** **** {item.last4}</Text>
            <Pressable
              style={{ backgroundColor: "blue", padding: 10, marginVertical: 5 }}
              onPress={() => handlePayment(item.authorization_code, 500)} // Replace 500 with actual order amount
            >
              <Text style={{ color: "white" }}>Use Card</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text>No cards added yet.</Text>}
      />

      <Pressable
        style={{
          backgroundColor: "blue",
          padding: 15,
          marginTop: 20,
          borderRadius: 5,
        }}
        onPress={handleAddCard}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Add Card</Text>
      </Pressable>
    </View>
  );
};

export default ManagePaymentMethods;
