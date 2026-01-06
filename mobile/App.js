import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'EcoCampus Vitrin' }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş Yap' }} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'İlan Ekle' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}