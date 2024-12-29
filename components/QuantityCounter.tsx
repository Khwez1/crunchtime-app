import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const QuantityCounter = ({ quantity, onIncrement, onDecrement }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onDecrement} style={[styles.button, styles.decrementButton]}>
        <Text style={styles.buttonText}>-</Text>
      </Pressable>
      <Text style={styles.quantityText}>{quantity}</Text>
      <Pressable onPress={onIncrement} style={[styles.button, styles.incrementButton]}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'flex-start',
    flex: 1,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  decrementButton: {
    backgroundColor: 'yellow',
  },
  incrementButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
});

export default QuantityCounter;