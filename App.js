import * as React from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/homeScreen';
import QrCodeScreen from './screens/qrCodeScreen';
import SaisieCodeScreen from './screens/saisieCodeScreen';
import aboutScreen from './screens/aboutScreen';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTab() {
  return (
    <Tab.Navigator initialRouteName="Accueil">
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
        }} 
      />

      <Tab.Screen 
        name="SaisieCode" 
        component={SaisieCodeScreen}
        options={{
          title: 'Saisir le Code',
          tabBarLabel: 'Saisir le Code',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'barcode'} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Accueil',
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
        name="Mes signalements" 
        component={QrCodeScreen}
        options={{
          tabBarLabel: 'Signalements',
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
        name="À propos" 
        component={aboutScreen}
        options={{
          tabBarLabel: 'À propos',
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
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="Login" options={  options={ headerShown: true, title: 'Login' }}>
              {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
          )}
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;