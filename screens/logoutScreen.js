import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation, setIsLoggedIn }) => {
    useEffect(() => {
        const handleLogout = async () => {
            await AsyncStorage.removeItem("loggedInUserUuid");
            setIsLoggedIn(false);
            navigation.navigate('Login');
        };

        handleLogout();
    }, []);

    return null; 
};

export default LogoutScreen;
