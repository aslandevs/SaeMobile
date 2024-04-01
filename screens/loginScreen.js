import React, { useState,useContext ,createContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {getDocs, query, collection} from 'firebase/firestore';
import db from '../db/firestore';
import { AuthContext } from '../context/AuthContext';


const LoginScreen = ({setIsLoggedIn}) => {
    const [email, setEmailLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const {setRole, setEmail } = useContext(AuthContext);

    const handleLogin = () => {

        if (!email || !password) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        getDocs(query(collection(db, 'user'))).then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                if (doc.data().email === email && doc.data().password === password) {
                    setRole(doc.data().role);
                    setEmail(doc.data().email);
                    setIsLoggedIn(true);
                    console.log('Login success');
                } else {
                    console.log('Identifiants incorrects');
                }

            });
        }).catch((error) => {
            console.log('Error getting documents: ', error);
        }
        );
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
                    style={{ margin: 10 }}
                    onPress={handleLogin}>
                    Login
                </Button>

                <Button
                    mode="outlined"
                    style={{ margin: 10 }}
                    onPress={handleRegister}>
                    Register
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