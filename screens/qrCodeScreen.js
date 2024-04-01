import React, { useState, useEffect } from 'react';
import { Camera, FlashMode } from 'expo-camera';
import { View, Image, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid, Button as RNButton  } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import { BarCodeScanner, BarCodeScannerConstants } from 'expo-barcode-scanner';
import { Alert } from 'react-native';
import data  from '../assets/json/medic.json';

const QrCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [visible, setModalVisibility] = useState(false);

  const showHelpModal = () => setModalVisibility(true);
  const hideHelpModal = () => setModalVisibility(false);


  const handleCameraPermission = async () => {
    console.log('handleCameraPermission called');
    if (Platform.OS === 'android') {
      console.log('Platform is Android');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('Permission result:', granted);
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      console.log('Platform is iOS');
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Permission result:', status);
      setHasPermission(status === 'granted');
      return status === 'granted';
    }
  };

  useEffect(() => {
    handleCameraPermission();
  }, []);

  const toggleCamera = () => {
    setIsCameraOpen(prevState => !prevState);
  };

  const extraireCIP = (value) => {
    return value.slice(3, 16);
  }

  const extraireNom = (value) => {
    const newdata = data["medic"];
    for (let i = 0; i < newdata.length; i++) {
      if (value == newdata[i].cip13) {
        return newdata[i].produit.toLowerCase();
      }
    }
    return "Médicament inconnu";
  }
  const handleBarCodeScanned = ({ data }) => {
    if (data && data !== scannedData) {
      setScannedData(data);
      Alert.alert(
        'DataMatrix Scanner',
        `Le Code CIP: ${extraireCIP(data)}`+
        `\nNom du médicament: ${extraireNom(extraireCIP(data))}`
        ,
        [
          {
            text: 'Report',
            onPress: () => setScannedData(null),
          },
          {
            text: 'Annuler',
            onPress: () => setScannedData(null),
          },
        ],
        { cancelable: false }
      );

    }
  };



  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={handleCameraPermission}>
          <Text style={styles.buttonText}>Allow Camera Access</Text>
        </TouchableOpacity>          
      </View>
    );
  }

  return (
    <Provider>
      {isCameraOpen && (
        <Camera
          style={styles.camera}
          type={type}
          barCodeScannerProps={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.datamatrix]
          }}
          autoFocus={Camera.Constants.AutoFocus.on}
          onBarCodeScanned={handleBarCodeScanned}
        >

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}
            >
              Tourner la caméra
            </Button>
          </View>

        </Camera>
      )}

      <View
        style={styles.container}
      >
        <Image style={{ width: 150, height: 150 }} source={require('../assets/images/qr_code_exemple.png')} />
        <Button
          mode="contained"
          onPress={toggleCamera}
        >
          {isCameraOpen ? "Ne plus Scanner le QR Code" : "Scanner le QR Code"}
        </Button>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 15 }}>
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
              source={require('../assets/images/helpqrcode/help_qrcode.png')}
              style={{ width: 174, height: 232, resizeMode: 'cover' }}
            ></Image>
            <Text
              style={{ textAlign: 'justify', marginTop: 15, fontSize: 15 }}
            >
              Scannez vos médicaments à l’aide de l’appareil photo pour obtenir le code CIP.
              </Text>

            <Button
              mode="contained"
              onPress={() => hideHelpModal()}
              style={[styles.btnHelp, { marginBottom: -16, marginTop: 30 }]}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
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
  button: {
    backgroundColor: 'blue', // Couleur de fond du bouton
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', // Couleur du texte du bouton
    fontWeight: 'bold',
  },
});

export default QrCodeScreen;