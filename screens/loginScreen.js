import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {

        if (email === 'test' && password === '123') {
            setIsLoggedIn(true);
        } else {
            console.log('Identifiants incorrects');
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