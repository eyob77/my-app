import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase } from './src/database/database';

// Temporary placeholders for screens
import InventoryScreen from './src/screens/InventoryScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    initDatabase(); // This creates your tables on the very first run
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Stock List') {
              iconName = "list";
            } else if (route.name === 'Add New Item') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }

            // Return the icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db', // Blue when active
          tabBarInactiveTintColor: 'gray',   // Gray when not active
        })}
      >
        <Tab.Screen name="Stock List" component={InventoryScreen} />
        <Tab.Screen name="Add New Item" component={RegisterScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}