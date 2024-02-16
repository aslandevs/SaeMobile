import React, { useState, useEffect } from 'react';
import { Camera,FlashMode } from 'expo-camera';
import { View, Image, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Alert } from 'react-native';

const QrCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleCamera = () => {
    setIsCameraOpen(prevState => !prevState);
  };


  const handleBarCodeScanned = ({ data }) => {
    if (data && data !== scannedData) {
      setScannedData(data);
      Alert.alert(
        'QR Code Scanned',
        `Data: ${data}`,
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isCameraOpen && (
                <Camera
                      style={styles.camera}
                      type={type}
                      barCodeScannerProps={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                      }}
                      onBarCodeScanned={handleBarCodeScanned}
                >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setType(
              type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      <Image style={{ width: 150, height: 150 }} source={require('../assets/images/qr_code_exemple.png')} />
      <Button
        title={isCameraOpen ? "Ne plus Scanner le QR Code" : "Scanner le QR Code"}
        onPress={toggleCamera}
      />
    </View>
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
  button: {
    backgroundColor: '#8EC641',
    borderRadius: 50,
    padding: 15,
  },
  buttonFlash: {
    backgroundColor: '#8EC641',
    position: 'absolute',
    left: 180,
    borderRadius: 50,
    padding: 15,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
});

export default QrCodeScreen;
