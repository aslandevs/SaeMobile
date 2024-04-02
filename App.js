import React, { useContext,useState, useEffect} from 'react';
import { StatusBar, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import QrCodeScreen from './screens/qrCodeScreen';
import SaisieCodeScreen from './screens/saisieCodeScreen';
import aboutScreen from './screens/aboutScreen';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import MesReportScreen from './screens/mesreportScreen';
import AdminScreen from './screens/adminScreen';
import ProfilScreen from './screens/profilScreen';
import LogoutScreen from './screens/logoutScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDocs, query, collection, onSnapshot} from 'firebase/firestore';
import db from './db/firestore';
import NetInfo from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTab = ({autorole, autoemail}) => {
  const { role, setRole, email, setEmail  } = useContext(AuthContext);
  const { t } = useTranslation();
  const trans = (key) => t(key);

  useEffect(() => {
    
    if (!role && autorole) {
      setRole(autorole);
    }
    if (!email && autoemail) {
      setEmail(autoemail);
    }
  }, [role, email]);

  return (
    <Tab.Navigator initialRouteName="DataMatrix" 
    
      screenOptions={{ 
    tabBarActiveTintColor: '#29AAE4', 
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      display: 'flex'
    }
  }}>
      <Tab.Screen 
        name="DataMatrix" 
        component={QrCodeScreen}
        options={{
          title: 'DataMatrix',
          tabBarLabel: 'DataMatrix',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'qr-code'}
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
          title: trans('app_SaisieCode'),
          tabBarLabel: trans('app_SaisieCode'),
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
        name="Mes signalements" 
        component={MesReportScreen}
        options={{
          title: trans('app_Signalement_title'),
          tabBarLabel: trans('app_Signalement'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={'document-text'} 
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
          component={AdminScreen} 
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
        name= {trans('app_Profil')}
        component={ProfilScreen}
        options={() => ({
          tabBarLabel: trans('app_Profil'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={'person'}
              size={size}
              color={color}
            />
          ),
        })}
      />

      
      <Tab.Screen 
        name= {trans('app_About')} 
        component={aboutScreen}
        options={{
          tabBarLabel: trans('app_About'),
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



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [autorole, setRole] = useState('user');
  const [autoemail, setEmail] = useState('');

  const handleLogout = () => {
    AsyncStorage.removeItem("loggedInUserUuid");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const getUserInfoFromFirestore = async () => {
      try {
        const isConnected = await NetInfo.fetch().then(state => state.isConnected);

        const userId = await AsyncStorage.getItem('loggedInUserUuid') || null;
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
 // const { t } = useTranslation();


  // const reportsCollection = collection(db, 'reports');

  // const unsubscribe = onSnapshot(reportsCollection, (snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
  //     const reportData = change.doc.data();
  //     console.log('Changement détecté:', change.type, reportData);
  //   });
  // });
  
  
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <StatusBar barStyle='default' />
                <NavigationContainer>
                    <Stack.Navigator>
                        {isLoggedIn ? (
                            <>
                                <Stack.Screen name="MainTab" options={{ headerShown: false }}>
                                  {props => <MainTab {...props} autorole={autorole} autoemail={autoemail} />}
                                </Stack.Screen>
                                <Stack.Screen name="Logout" options={{ headerShown: false }}>
                                    {props => <LogoutScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
                                </Stack.Screen>
                            </>
                        ) : (
                            <Stack.Screen name="Login" options={{ headerShown: true, title: 'login' }}>
                                {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
                            </Stack.Screen>
                        )}
                        <Stack.Screen name="Register" options={{title:'register'}}  component={RegisterScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </AuthProvider>
    );
}

export default App;