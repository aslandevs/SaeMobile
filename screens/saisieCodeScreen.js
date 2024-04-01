import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert,TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import data from '../assets/json/medic.json';


const extraireNom = (value) => {
  const newdata = data["medic"];
  for (let i = 0; i < newdata.length; i++) {
    if (value == newdata[i].cip13) {
      return newdata[i].produit;
    }
  }
  return null;
};


const checkmedic = (value) => {

  const CipCode = parseInt(value,10);

  if (!CipCode) { 
    Alert.alert('Erreur', "Champ vide");
    return;
  }

  const medicname = extraireNom(CipCode);

  if (!medicname) {
    Alert.alert('Erreur', 'Code CIP invalide');
    return;
  }

  Alert.alert(
    'Information sur le médicament',
    `\nNom du médicament: `+medicname
    ,
    [
      {
        text: 'Report',
        onPress: () => setCipValue(),
      },
      {
        text: 'Annuler',
        onPress: () => setCipValue(),
      },
    ],
    { cancelable: false }
  );
};




const SaisieCodeScreen = () => {
  const [visible, setVisible] = useState(false);
  const [cipValue, setCipValue] = useState();

  const showHelpModal = () => setVisible(true);
  const hideHelpModal = () => setVisible(false);

  return (
    <Provider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <TextInput
            mode="outlined"
            label="Code CIP"
            placeholder="Entrer le code CIP du médicament"
            style={{width: 300, marginBottom: 20}}
            value={cipValue}
            onChangeText={text => setCipValue(text)}
            keyboardType="numeric"
          />

          <Button
            mode="contained"
            onPress={() => checkmedic(cipValue)}
            style={styles.button}
          >
            Valider
          </Button>

        </View>
      </TouchableWithoutFeedback>
      
      <View style={{flex: 1, justifyContent: 'flex-end'}}>

        <Button
          mode="contained"
          onPress={() => showHelpModal()}
          style={styles.btnHelp}
        >
          Aide
        </Button>

      </View>
      <Portal>
        <Modal visible={visible} onDismiss={hideHelpModal}>
          <View style={styles.modalView}>
            <Image
              source={require('../assets/images/helpsaisie/help1.png')}
              style={{ width: 300, height: 100 }}
            ></Image>
            <Text
              style={styles.textHelp}
            >
            Le code CIP ou Code Identifiant de Présentation est un code numérique à 7 ou 13 chiffres qui permet d'identifier une présentation (ou encore conditionnement) d'un médicament.
            </Text>

            <Button
              mode="contained"
              onPress={() => hideHelpModal()}
              style={[styles.btnHelp, {marginBottom: -16,marginTop: 30}]}
            >
              Fermer
            </Button>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnHelp: {
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 16,

  },
  textHelp:{
    fontSize: 15,
    marginTop: 15,
    textAlign: 'justify',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 35,
    marginRight: 35,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SaisieCodeScreen;
