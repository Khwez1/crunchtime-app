import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";

const PaymentScreen = () => {
  const { amount, email } = useLocalSearchParams(); // Get payment details
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const PAYSTACK_SECRET_KEY = "pk_test_ce36637b72ecdff5c3c1d82c22d924f139e9276e"; // Replace with your Paystack secret key

  const initializePayment = async () => {
    if (!email || !amount) {
      Alert.alert("Error", "Invalid payment details. Please try again.");
      router.replace("/checkout"); // Redirect back to the checkout screen
      return;
    }

    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          redirect_url: "https://paystack.com/pay/crunchpay/success", // Update with your actual redirect URL
        }),
      });
      

      const data = await response.json();

      if (response.ok && data?.data?.authorization_url) {
        setPaymentUrl(data.data.authorization_url);
      } else {
        throw new Error(data.message || "Failed to initialize payment.");
      }
    } catch (error) {
      Alert.alert("Payment Error", error.message || "Something went wrong.");
      router.replace("/checkout");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializePayment();
  }, []);

  const handleNavigationStateChange = (event) => {
    const { url } = event;

    if (url.includes("https://paystack.com/pay/crunchpay/success")) {
      Alert.alert("Payment Successful", "Thank you for your purchase!");
      router.replace("/order-success");
    } else if (url.includes("https://your_redirect_url.com/failure")) {
      Alert.alert("Payment Failed", "Please try again.");
      router.replace("/checkout");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initializing Payment...</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    />
  );
};

export default PaymentScreen;
