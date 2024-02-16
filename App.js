// In App.js in a new project

import * as React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/homeScreen';
import QrCodeScreen from './screens/qrCodeScreen';
import SaisieCodeScreen from './screens/saisieCodeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();


function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
      <Tab.Screen 
      name="QR_CODE" 
      component={QrCodeScreen}
      options={{
        title: 'QR CODE',
        tabBarLabel: 'QR CODE',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons 
            name={'qr-code-outline'} 
            size={size} 
            color={color} 
          />
        ),
      }} />

    <Tab.Screen 
      name="SaisieCode" 
      component={SaisieCodeScreen}
      options={{
        title: 'Saisier le Code',
        tabBarLabel: 'Saisier le Code',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons 
            name={'barcode'} 
            size={size} 
            color={color} 
          />
        ),
      }} />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Welcome',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'home'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Soon" 
        component={QrCodeScreen}
        options={{
          title: 'Soon',
          tabBarLabel: 'Soon',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'help'} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SaisieCodeScreen}
        options={{
          title: 'Aide',
          tabBarLabel: 'Aide',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'help-circle'} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      </Tab.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
  );
}

export default App;