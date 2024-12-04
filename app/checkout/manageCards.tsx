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

    // This step requires a user authorization (which is typically handled by Paystack's frontend JS SDK or Checkout API)
    const email = "user@example.com"; // User's email for authorization

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
          amount: 1, // A small amount for tokenization
        }),
      });

      const initData = await initResponse.json();

      if (initResponse.ok) {
        console.log("Initialization Response:", initData);
        const checkoutUrl = initData.data.authorization_url;
        
        // Redirect user to Paystack's checkout page for payment authorization
        Alert.alert("Redirect to Paystack", "Please complete the payment authorization.");
        
        // Open the URL in a browser or in-app browser
        Linking.openURL(checkoutUrl).catch(err => console.error("Failed to open URL:", err));

        // Step 2: After the user completes the payment, handle the authorization code
        // This part would require monitoring the webhook or redirect response
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
