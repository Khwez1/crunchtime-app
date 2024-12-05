import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, Alert, Linking } from "react-native";
import { useNavigation } from "expo-router";

const ManagePaymentMethods = () => {
  const [cards, setCards] = useState([]); // Store added cards
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const PAYSTACK_SECRET_KEY = "sk_test_88a37c101af3d49f219f64bfe0eb19f514d37f3f"; // Replace with your Paystack secret key

  const handleAddCard = async () => {
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      Alert.alert("Error", "Please fill in all card details.");
      return;
    }
  
    const email = "user@example.com"; // User's email
    try {
      // Step 1: Initialize the transaction
      const initResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          amount: 100, // Amount in kobo (smallest currency unit)
        }),
      });
  
      const initData = await initResponse.json();
  
      if (initResponse.ok) {
        const checkoutUrl = initData.data.authorization_url;
        const reference = initData.data.reference;
  
        // Redirect user to Paystack's checkout page
        Linking.openURL(checkoutUrl).catch((err) =>
          console.error("Failed to open URL:", err)
        );
  
        // Step 2: Verify transaction after authorization
        const verifyTransaction = async () => {
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
            const authorizationCode = verifyData.data.authorization.authorization_code;
            const cardDetails = verifyData.data.authorization;
  
            // Save the card (e.g., last 4 digits, authorization_code) to Appwrite
            await saveCardToAppwrite(email, authorizationCode, cardDetails);
  
            Alert.alert("Success", "Card added successfully!");
          } else {
            Alert.alert("Error", "Transaction verification failed.");
          }
        };
  
        // Poll for transaction verification
        setTimeout(verifyTransaction, 10000); // Delay to allow user to complete payment
      } else {
        throw new Error(initData.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Error adding card:", error.message);
      Alert.alert("Error", error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to save card details to Appwrite
  const saveCardToAppwrite = async (email, authorizationCode, cardDetails) => {
    try {
      const response = await fetch("https://cloud.appwrite.io/v1/database/collections/cards/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": "66bb50ba003a365f917d",
          "X-Appwrite-Key": "standard_add181f317649bdb7c3889dd9953c762a89719123658e4798e0a5b313bccb335ecd411952040a4f2604e875c8ea88aebee2a27a2a323a0db6cc8673a1eff005255b40f75898006b56f880b59e5a33e4b1a79c8e8faab83acd57d30c1772727c0bc33b0c8e3baaee83f1996529be2eeae68f7059f0b7e15141c972d4a966d001f",
        },
        body: JSON.stringify({
          data: {
            email,
            authorizationCode,
            last4: cardDetails.last4,
            exp_month: cardDetails.exp_month,
            exp_year: cardDetails.exp_year,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save card to Appwrite");
      }
  
      console.log("Card saved to Appwrite");
    } catch (error) {
      console.error("Error saving card to Appwrite:", error.message);
    }
  };
  

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Manage Payment Methods</Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Saved Cards</Text>

      <FlatList
        data={cards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            **** **** **** {item.token.slice(-4)} {/* Show only last 4 digits of the token */}
          </Text>
        )}
        ListEmptyComponent={<Text>No cards added yet.</Text>}
      />

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>Add New Card</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginTop: 10,
          marginBottom: 10,
        }}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginRight: 10,
            flex: 1,
          }}
          placeholder="MM"
          value={expiryMonth}
          onChangeText={setExpiryMonth}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            flex: 1,
          }}
          placeholder="YYYY"
          value={expiryYear}
          onChangeText={setExpiryYear}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginTop: 10,
        }}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        maxLength={3}
      />

      <Pressable
        style={{
          backgroundColor: isLoading ? "gray" : "blue",
          padding: 15,
          marginTop: 20,
          borderRadius: 5,
        }}
        onPress={handleAddCard}
        disabled={isLoading}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          {isLoading ? "Adding Card..." : "Add Card"}
        </Text>
      </Pressable>
    </View>
  );
};

export default ManagePaymentMethods;
