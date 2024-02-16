import React from 'react';
import { View,TextInput,Button, Text, StyleSheet } from 'react-native';

const SaisieCodeScreen = () => {
  return (
    <View style={styles.container}>
    <TextInput style={styles.TextInput} placeholder='Saisier le code' />
    <Button title="Valider la Saisie" onPress={() => alert('Button pressed')} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width:'80%',
    backgroundColor: 'lightgrey',
    borderRadius: 10,
  },
});

export default SaisieCodeScreen;
