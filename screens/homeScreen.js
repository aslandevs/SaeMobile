import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import profilScreen from './qrCodeScreen';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'intl-pluralrules';

const HomeScreen = ({navigation}) => {
    return (
      <View>
        <Text style={styles.text}>Bienvenue sur ScanMyMeds !</Text>

      </View>
    );
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 25,
      textAlign: 'center',
    },
  });

export default HomeScreen;
