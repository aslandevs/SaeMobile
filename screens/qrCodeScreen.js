import React, { useState, useEffect } from 'react';
import { Camera,FlashMode } from 'expo-camera';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import { BarCodeScanner, BarCodeScannerConstants  } from 'expo-barcode-scanner';
import { Alert } from 'react-native';

const QrCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [visible, setModalVisibility] = useState(false);

  const showHelpModal = () => setModalVisibility(true);
  const hideHelpModal = () => setModalVisibility(false);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleCamera = () => {
    setIsCameraOpen(prevState => !prevState);
  };

  function extraireCIP(value) {
    return value.slice(3, 16);
}


  const handleBarCodeScanned = ({ data }) => {
    if (data && data !== scannedData) {
      setScannedData(data);
      Alert.alert(
        'QR Code Scanned',
        `Data: ${data}\nCIP: ${extraireCIP(data)}`,
        [
          {
            text: 'OK',
            onPress: () => setScannedData(null),
          },
        ],
        { cancelable: false }
      );
    }
  };

  if (hasPermission === null) { return <View />;}
  if (hasPermission === false) {return <Text>No access to camera</Text>;}

  return (
    <Provider>
      {isCameraOpen && (
        <Camera
          style={styles.camera}
          type={type}
          barCodeScannerProps={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.datamatrix]}}
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
      <View  style={{alignItems:'center', marginBottom: 15}}>
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
                style={{ width: 174, height: 232, resizeMode: 'cover'}}
              ></Image>
              <Text
                style={{textAlign: 'justify', marginTop: 15, fontSize: 15}}
              >
                Scannez vos médicaments à l’aide de l’appareil photo pour obtenir le code CIP.
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
});

export default QrCodeScreen;
