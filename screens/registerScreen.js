import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Provider } from 'react-native-paper';
import {addDoc, collection, doc, setDoc} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import db from '../db/firestore';




const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');

    const navigation = useNavigation();


    const generateUUID = () => {
        const currentDate = new Date().getTime().toString(36);
        const randomString = Math.random().toString(36).substring(2, 15);
        return currentDate + '-' + randomString;
      };

      
    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (!email.includes('@')) {
            alert('Email invalide');
            return;
        }

        if (password.length < 6) {
            alert('Le mot de passe doit contenir au moins 6 caractÃ¨res');
            return;
        }
        

        if (password === confirmPassword) {
            addDoc(collection(db, 'user'), {
                uuid:  generateUUID(),
                email: email,
                password: password,
                role: role,
            }).then(() => {
                    alert('Utilisateur cree avec succes');
                    navigation.navigate('Login');
            }).catch(error => {
                    alert('Erreur lors de la crÃ©ation de l\'utilisateur');
                    console.error(error);
            });
            
        } else {
            alert('Les deux mots de passe ne sont pas identiques')
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
            <View style={styles.content}>
                <TextInput
                    label="Email"
                    placeholder="Email"
                    keyboardType="email-address"
                    style={{ margin: 10 }}
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    label="Password"
                    placeholder="Password"
                    secureTextEntry
                    style={{ margin: 10 }}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <TextInput
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    secureTextEntry
                    style={{ margin: 10 }}
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                />
                <Button
                    mode="contained"
                    style={{ margin: 10 }}
                    onPress={handleRegister}>
                    Register
                </Button>
            </View>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        padding: 20,
    },
});

export default RegisterScreen;