import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import db from '../database/database';

export default function InventoryScreen() {
  const [items, setItems] = useState([]);

  // This refreshes the list every time you click the "Stock List" tab
  useFocusEffect(
    useCallback(() => {
      const result = db.getAllSync('SELECT * FROM products');
      setItems(result);
    }, [])
  );

  const renderItem = ({ item }) => {
    const isLow = item.quantity <= item.minThreshold;

    return (
      <View style={[styles.card, isLow && styles.lowStock]}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>
        </View>
        <View style={styles.stockInfo}>
          <Text style={[styles.qty, isLow && styles.lowText]}>{item.quantity}</Text>
          <Text style={styles.label}>In Stock</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Your inventory is empty.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 3 },
  lowStock: { borderColor: '#e74c3c', borderWidth: 2 },
  name: { fontSize: 18, fontWeight: 'bold' },
  sku: { color: '#777', marginTop: 4 },
  stockInfo: { alignItems: 'center' },
  qty: { fontSize: 24, fontWeight: 'bold' },
  lowText: { color: '#e74c3c' },
  label: { fontSize: 12, color: '#999' },
  empty: { textAlign: 'center', marginTop: 100, color: '#999' }
});