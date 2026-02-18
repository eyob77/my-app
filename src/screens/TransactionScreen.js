import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import db from '../database/database';

export default function TransactionScreen({ route, navigation }) {
  const { item } = route.params; // Get the stationery item passed from the list
  const [amount, setAmount] = useState('');

  const handleTransaction = (type) => {
    const qtyChange = parseInt(amount);
    if (isNaN(qtyChange) || qtyChange <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      return;
    }

    // Calculate new total
    const newTotal = type === 'IMPORT' ? item.quantity + qtyChange : item.quantity - qtyChange;

    if (type === 'SALE' && newTotal < 0) {
      Alert.alert("Error", "Not enough stock to sell!");
      return;
    }

    try {
      // 1. Update the Product Quantity
      db.runSync('UPDATE products SET quantity = ? WHERE id = ?', [newTotal, item.id]);

      // 2. Log the Transaction with automatic Timestamp (Requirement #3 & #4)
      db.runSync(
        'INSERT INTO transactions (productId, type, amount) VALUES (?, ?, ?)',
        [item.id, type, qtyChange]
      );

      // 3. Low Stock Check (Requirement #2)
      if (newTotal <= item.minThreshold) {
        Alert.alert("Low Stock Warning", `${item.name} is now at ${newTotal} units!`);
      } else {
        Alert.alert("Success", "Stock updated successfully.");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Database Error", "Failed to update stock.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.currentStock}>In Stock: {item.quantity}</Text>

      <TextInput
        placeholder="Enter quantity"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.btn, styles.importBtn]} 
          onPress={() => handleTransaction('IMPORT')}
        >
          <Text style={styles.btnText}>+ Import (Stock In)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, styles.saleBtn]} 
          onPress={() => handleTransaction('SALE')}
        >
          <Text style={styles.btnText}>- Sell (Stock Out)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  currentStock: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, fontSize: 20, textAlign: 'center', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' },
  importBtn: { backgroundColor: '#2ecc71' },
  saleBtn: { backgroundColor: '#e67e22' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});