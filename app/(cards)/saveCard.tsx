import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SaveCard = () => {
  const router = useRouter();

  const handleSaveCard = () => {
    // Placeholder for saving card logic
    console.log('Card saved successfully');
    router.back(); // Navigate back to checkout after saving
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Card</Text>
      <TextInput style={styles.input} placeholder="Card Number" keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Expiration Date (MM/YY)" keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="CVV" keyboardType="number-pad" />
      <Pressable style={styles.button} onPress={handleSaveCard}>
        <Text style={styles.buttonText}>Save Card</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#FFF' },
  button: { backgroundColor: '#FF6F61', padding: 16, alignItems: 'center', borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});

export default SaveCard;
