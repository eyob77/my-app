import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import db from '../database/database';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState('');
  const [minLevel, setMinLevel] = useState('5');

  const saveProduct = () => {
    if (!name || !sku || !qty) {
      Alert.alert("Missing Info", "Please fill in Name, SKU, and Quantity.");
      return;
    }

    try {
      db.runSync(
        'INSERT INTO products (name, sku, quantity, minThreshold) VALUES (?, ?, ?, ?)',
        [name, sku, parseInt(qty), parseInt(minLevel)]
      );
      Alert.alert("Success", `${name} has been registered.`);
      
      // Reset form and go to list
      setName(''); setSku(''); setQty('');
      navigation.navigate('Stock List');
    } catch (error) {
      Alert.alert("Error", "SKU already exists. Try a different code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Stationery Item</Text>
      
      <TextInput placeholder="Item Name (e.g. A4 Notebook)" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="SKU / Barcode" style={styles.input} value={sku} onChangeText={setSku} />
      <TextInput placeholder="Current Quantity" style={styles.input} value={qty} onChangeText={setQty} keyboardType="numeric" />
      <TextInput placeholder="Low Stock Alert Level" style={styles.input} value={minLevel} onChangeText={setMinLevel} keyboardType="numeric" />

      <TouchableOpacity style={styles.btn} onPress={saveProduct}>
        <Text style={styles.btnText}>Register Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15 },
  btn: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});