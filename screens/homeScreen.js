import React from 'react';
import { View, Text } from 'react-native';
import profilScreen from './qrCodeScreen';
import { Button } from 'react-native';

const HomeScreen = ({navigation}) => {
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigation.navigate('Profile', {name: 'Jane'})
        }
      />
    );
  };


export default HomeScreen;
