import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { saveCardAuthorization } from '~/lib/appwrite';

const AddCard = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const { user } = useGlobalContext();

  useEffect(() => {
    console.log('User in AddCard:', user);
  }, [user]);

  const maskCardNumber = (number) => {
    return number.slice(-4).padStart(number.length, '*');
  };

  const handleAddCard = async () => {
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !email) {
      Alert.alert('Error', 'Please fill in all card details including email');
      return;
    }
  
    try {
      const response = await axios.post(
        'https://api.paystack.co/charge/tokenize',
        {
          card: {
            number: cardNumber,
            expiry_month: expiryMonth,
            expiry_year: expiryYear,
            cvv: cvv,
          },
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer sk_test_a49451f1e7cf3bc6793d3d20d95fff75893e20b9`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.status === true) {
        console.log('Full Response Data:', JSON.stringify(response.data, null, 2));
        const authorizationData = response.data.data;
        if (authorizationData && authorizationData.authorization_code) {
          const authorizationCode = authorizationData.authorization_code;
          const maskedNumber = maskCardNumber(cardNumber);
          if (user && user.$id) {
            // Determine card type from Paystack's response
            const cardType = authorizationData.card_type.toLowerCase().includes('credit') ? 'Credit' : 'Debit';
            await saveCardAuthorization(user.$id, authorizationCode, maskedNumber, cardType);
            Alert.alert('Success', `Card saved! Authorization Code: ${authorizationCode}`);
          } else {
            console.error('User ID is not available in context');
            Alert.alert('Error', 'User ID not available. Please log in again.');
          }
        } else {
          Alert.alert('Success', 'Card saved, but no authorization code received.');
        }
      } else {
        Alert.alert('Error', 'Unable to add the card or unexpected response format.');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      if (error.response) {
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        console.error('Status:', error.response.status);
        console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      }
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
    }
  };

  if (!user) {
    return <Text>No user data available. Please log in.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Card</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="number-pad"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Month (MM)"
        keyboardType="number-pad"
        value={expiryMonth}
        onChangeText={setExpiryMonth}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Year (YY)"
        keyboardType="number-pad"
        value={expiryYear}
        onChangeText={setExpiryYear}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        keyboardType="number-pad"
        secureTextEntry
        value={cvv}
        onChangeText={setCvv}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Pressable style={styles.button} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Save Card</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCard;