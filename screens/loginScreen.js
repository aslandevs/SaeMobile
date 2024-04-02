import React, { useState,useContext ,createContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {getDocs, query, collection, updateDoc} from 'firebase/firestore';
import db from '../db/firestore';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';

const LoginScreen = ({setIsLoggedIn}) => {
    const [email, setEmailLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const {setRole, setEmail } = useContext(AuthContext);
    const { t } = useTranslation();
    let userFound = false;

    const generateUUID = () => {
        const currentDate = new Date().getTime().toString(36);
        const randomString = Math.random().toString(36).substring(2, 15);
        return currentDate + '-' + randomString;
      };
      
    const handleLogin = async () => {

        if (!email || !password) {
            alert(t('login_fillAllFields'));
            return;
        }

        const isConnected = await NetInfo.fetch().then(state => state.isConnected);
        const userCredentials = await AsyncStorage.getItem('userCredentials');
        if (!isConnected) {
            if (userCredentials) {
                console.log('User credentials found');
                const { email, role } = JSON.parse(userCredentials);
                setRole(role);
                setEmail(email);
                setIsLoggedIn(true);
            }
    
        }else{
            getDocs(query(collection(db, 'user'))).then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().email === email && doc.data().password === password) {
                        userFound = true;
                        setRole(doc.data().role);
                        setEmail(doc.data().email);
                        let userUuid = doc.data().uuid;
                        if (doc.data().uuid == '' || doc.data().uuid == ""){
                            userUuid = generateUUID();
                            updateDoc(doc.ref, {
                                uuid: userUuid
                            });
                        }
                        setIsLoggedIn(true);
                        AsyncStorage.setItem('loggedInUserUuid', userUuid);
                        AsyncStorage.setItem('userCredentials', JSON.stringify({email: doc.data().email, role: doc.data().role}));
                        alert(t('login_success'));
                        console.log('Login success');
                        
                    }
                });
                if (!userFound) {
                    console.log('Identifiants incorrects');
                    alert(t('login_incorrectCredentials'));
                }
            }).catch((error) => {
                console.log('Error getting documents: ', error);
            }
            );
        }
    };


    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <Provider>
            <View style={styles.container}>
                <TextInput
                    label="Email"
                    placeholder="Email"
                    keyboardType="email-address"
                    style={{ margin: 10 }}
                    value={email}
                    onChangeText={text => setEmailLogin(text)}
                />
                <TextInput
                    label="Password"
                    placeholder="Password"
                    secureTextEntry
                    style={{ margin: 10 }}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Button
                    mode="contained"
                    style={{ margin: 10, backgroundColor: "#8EC641" }}
                    onPress={handleLogin}>
                    {t('login_loginbtn')}
                </Button>

                <Button
                    mode="contained"
                    style={{ margin: 10, backgroundColor: "#8EC641" }}
                    onPress={handleRegister}>
                    {t('login_registerbtn')}
                </Button>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 200,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 25,
        textAlign: 'center',
    },
});

export default LoginScreen;