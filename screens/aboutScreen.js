import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native'; // Importez Dimensions
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

function AboutScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={[styles.text]}>
            Version : 1.0
        </Text>
        <Text style={styles.text}>
            {t("about_message")} :{'\n'}AbdulHakim{'\n'}Christophe{'\n'}Laksan{'\n'}Yohann
        </Text>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  box: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'black', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    padding: 10,
    textAlign: 'center',
  },
});

export default AboutScreen;
