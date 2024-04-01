import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Provider } from 'react-native-paper';

const RegisterScreen = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        if (!nom || !email || !password || !confirmPassword) {
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

            console.log('Email:', email);
            console.log('Password');
            
        } else {
            alert('Les deux mots de passe ne sont pas identiques')
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
            <View style={styles.content}>
                <TextInput
                    label="Nom"
                    placeholder="Nom"
                    style={{ margin: 10 }}
                    value={nom}
                    onChangeText={text => setNom(text)}
                />
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