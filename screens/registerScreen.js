import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Provider } from 'react-native-paper';
import {addDoc, collection, doc, setDoc} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import db from '../db/firestore';
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';



const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const { t } = useTranslation();

    const navigation = useNavigation();


    const generateUUID = () => {
        const currentDate = new Date().getTime().toString(36);
        const randomString = Math.random().toString(36).substring(2, 15);
        return currentDate + '-' + randomString;
      };

      
    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            alert(t('register_fillAllFields'));
            return;
        }

        if (!email.includes('@')) {
            alert(t('register_invalidEmail'));
            return;
        }

        if (password.length < 6) {
            alert(t('register_passwordLength'));
            return;
        }
        

        if (password === confirmPassword) {
            addDoc(collection(db, 'user'), {
                uuid:  generateUUID(),
                email: email,
                password: password,
                role: role,
            }).then(() => {
                    alert(t('register_success'));
                    navigation.navigate('Login');
            }).catch(error => {
                    alert(t('register_error'));
                    console.error(error);
            });
            
        } else {
            alert(t('register_passwordMatch'));
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
                    label= {t('password')}
                    placeholder= {t('password')}
                    secureTextEntry
                    style={{ margin: 10 }}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <TextInput
                    label= {t('password_confirm')}
                    placeholder= {t('password_confirm')}
                    secureTextEntry
                    style={{ margin: 10 }}
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                />
                <Button
                    mode="contained"
                    style={{ margin: 10, backgroundColor: "#8EC641" }}
                    onPress={handleRegister}>
                    {t('login_registerbtn')}
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