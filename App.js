import React, { useContext,useState, useEffect} from 'react';
import { StatusBar} from 'react-native';
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
import MesReportScreen from './screens/mesreportScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDocs, query, collection, onSnapshot} from 'firebase/firestore';
import db from './db/firestore';
import NetInfo from "@react-native-community/netinfo";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTab = ({autorole, autoemail}) => {
  const { role, setRole, email, setEmail  } = useContext(AuthContext);

  useEffect(() => {
    
    if (!role && autorole) {
      setRole(autorole);
    }
    if (!email && autoemail) {
      setEmail(autoemail);
    }
  }, [role, email]);

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
        component={MesReportScreen}
        options={{
          tabBarLabel: 'Signalements',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'help'} 
              size={size} 
              color={color} 
            />
          ),
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
        }} 
      />

      {role === 'admin' && (
        <Tab.Screen 
          name="Admin" 
          component={QrCodeScreen} 
          options={{
            tabBarLabel: 'Admin',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={'shield'}
                size={size} 
                color={color} 
              />
            ),
          }} 
        />
      )}
      
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
  const [autorole, setRole] = useState('user');
  const [autoemail, setEmail] = useState('');


  
  useEffect(() => {
    const getUserInfoFromFirestore = async () => {
      try {
        const isConnected = await NetInfo.fetch().then(state => state.isConnected);

        const userId = await AsyncStorage.getItem('loggedInUserUuid');
        const userCredentials = await AsyncStorage.getItem('userCredentials');
        if (userId) {
          if (!isConnected) {
            if (userCredentials) {
              const { email, role } = JSON.parse(userCredentials);
              setRole(role);
              setEmail(email);
              setIsLoggedIn(true);
            }        

          }else{
            getDocs(query(collection(db, 'user'))).then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.data().uuid === userId) {
                  setRole(doc.data().role);
                  setEmail(doc.data().email);
                  setIsLoggedIn(true);
                }
              });
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur depuis Firestore :', error);
      }
    };

    getUserInfoFromFirestore();
  }, []);

  const reportsCollection = collection(db, 'reports');

  const unsubscribe = onSnapshot(reportsCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const reportData = change.doc.data();
      console.log('Changement détecté:', change.type, reportData);
    });
  });
  
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle='default' />
        <NavigationContainer>
          <Stack.Navigator>
            {isLoggedIn ? (
              <Stack.Screen name="MainTab" options={{ headerShown: false }}>
                {props => <MainTab {...props} autorole={autorole} autoemail={autoemail} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Login" options={{ headerShown: true, title: 'Login'}}>
                {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
            )}
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default App;