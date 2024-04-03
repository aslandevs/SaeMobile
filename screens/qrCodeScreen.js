import React, { useState, useEffect, useContext } from 'react';
import { Camera, FlashMode } from 'expo-camera';
import { View, Image, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid ,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import { BarCodeScanner, BarCodeScannerConstants } from 'expo-barcode-scanner';
import { Alert } from 'react-native';
import data  from '../assets/json/medic.json';
import {addDoc, collection } from 'firebase/firestore';
import db from '../db/firestore';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { fetchReports } from './mesreportScreen';
import 'intl-pluralrules';
import { useTranslation } from 'react-i18next';

const QrCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [medicData, setMedicData] = useState(null);
  const [message, setMessage] = useState('');
  const [isReportButtonClicked, setIsReportButtonClicked] = useState(false);
  const [visible, setModalVisibility] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { t } = useTranslation();
  const {email, setReport} = useContext(AuthContext);

  const showHelpModal = () => setModalVisibility(true);
  const hideHelpModal = () => setModalVisibility(false);

  const showReportModal = () => setReportModalVisible(true);
  const hideReportModal = () => setReportModalVisible(false);


  const handleCameraPermission = async () => {

    if (Platform.OS === 'android') {

      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
      
    } else if (Platform.OS === 'ios') {
      const { status } = await Camera.requestCameraPermissionsAsync();
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
    return Platform.OS === 'ios' ? value.slice(3, 16) : value.slice(4, 17);
  }

  const extraireNom = (value) => {
    const newdata = data["medic"];
    for (let i = 0; i < newdata.length; i++) {
      if (value == newdata[i].cip13) {
        return newdata[i].nom_court.toLowerCase();
      }
    }
    return t('qrcode_inconnumedicament');
  }

  const extraireDetaille= (value) => {
    const newdata = data["medic"];
    for (let i = 0; i < newdata.length; i++) {
      if (value == newdata[i].cip13) {
        console.log(newdata[i]);
        return newdata[i]['Libellé_atc_2'].toLowerCase();
      }
    }
    return t('qrcode_inconnumedicament');
  }

  const handleBarCodeScanned = ({ data }) => {
    if (data) {
      console.log(data);
      setScannedData(data);
      const cip = extraireCIP(data);
      console.log(cip);
      const name = extraireNom(cip);
      const libelle_atc_2 = extraireDetaille(cip);
      setMedicData({ cip, name, libelle_atc_2});
      Alert.alert(
        t('qrcode_alert_title1'),
        `\n${t('qrcode_alert_codecip')}: ${cip}`+
        `\n\n${t('saisieCode_medicname')}: ${name}`+
        `\n\n${t('qrcode_alert_detail')} : \n${libelle_atc_2}`
        ,
        [
          {
            text: t('saisieCode_button_report'),
            onPress:showReportModal,
          },
          {
            text: t('cancel'),
            onPress: () => setScannedData(null) && setMedicData(null),
          },
        ],
        { cancelable: false }
      );
      setIsCameraOpen(false);
    }
  };

  const formatData = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate(); 
    const hours = date.getHours(); 
    const minutes = date.getMinutes(); 
    const seconds = date.getSeconds(); 

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
};


  const handleReport = async ({ nom, cip, message }) => {
    //setIsReportButtonClicked(true);

    const isconnected = await NetInfo.fetch().then(state => state.isConnected);
    if (!isconnected) {
      AsyncStorage.getItem('reports').then((localReports) => {
          console.log('localReports', localReports);
          if (localReports !== null) {
            const reports = JSON.parse(localReports);
            reports.push({ cip, medicament: nom, email, message, date: formatData(new Date()) });
            AsyncStorage.setItem('reports', JSON.stringify(reports));
            fetchReports({ email, setReport });
          } else {
            AsyncStorage.setItem('reports', JSON.stringify([{ cip, medicament: nom, email, message, date: formatData(new Date()) }]));
            fetchReports({ email, setReport });
          }
          setIsReportButtonClicked(false);
          hideReportModal();
          Alert.alert(
            t('saisieCode_alert_title2'),
            t('saisieCode_alert_message'),
            [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
              },
            ],
            { cancelable: false }
          );
        }
      ).catch((error) => {
        console.error('Error fetching reports:', error);
      });
    }else{
      addDoc(collection(db, 'report'), {
        cip: cip,
        medicament: nom,
        email: email,
        message: message,
        date: formatData(new Date()),
      }).then(() => {
        setIsReportButtonClicked(false);
        hideReportModal();
        Alert.alert(
          t('saisieCode_alert_title2'),
          t('saisieCode_alert_message'),
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          { cancelable: false }
        );
      }).catch(error => {
        console.error(error);
        setIsReportButtonClicked(false);
        Alert.alert(
          t('saisieCode_alert_title2'),
          t('saisieCode_alert_message_error'),
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          { cancelable: false }
        );
      });
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
              style={{ backgroundColor: "#8EC641" }}
            >
              {t('qrcode_switch_camera')}
            </Button>
          </View>

        </Camera>
      )}

      <View style={styles.container}>
        <Image style={{ width: 150, height: 150 }} source={require('../assets/images/qr_code_exemple.png')} />

        <Button mode="contained"onPress={toggleCamera} style={{ marginTop: 15, backgroundColor: "#8EC641" }}>
          {isCameraOpen ? t('qrcode_stopscan') : t('qrcode_scan')}
        </Button>

      </View>

      <View style={{ alignItems: 'center', marginBottom: 15 }}>

        <Button mode="contained" onPress={() => showHelpModal()} style={[styles.btnHelp,{backgroundColor: "#8EC641"}]} >
          {t('qrcode_help')}
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
              {t('qrcode_help_text')}
            </Text>

            <Button
              mode="contained"
              onPress={() => hideHelpModal()}
              style={[styles.btnHelp, { marginBottom: -16, marginTop: 30, backgroundColor: "#8EC641" }]}
            >
              {t('button_close')}
            </Button>
          </View>
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={reportModalVisible} onDismiss={hideReportModal} >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={styles.modalView}>
            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>
              {t('qrcode_report_title')}
            </Text>

              <TextInput label={t('saisieCode_medicname')} style={{ width: '100%', padding: 5}} multiline={true} numberOfLines={4} disabled={true} value={medicData?.name} />
              <TextInput label="Code CIP" style={{ width: '100%', padding: 5, margin: 15 }} disabled={true} value={medicData?.cip} />
              <TextInput label={t('saisieCode_problem')} style={{ width: '100%', padding: 5 }} multiline={true} numberOfLines={4} onChangeText={setMessage} />

              <Text style={{ marginTop: 325, paddingRight:110, fontSize: 12, position: 'absolute' }}> {t('qrcode_alert_detail')} :</Text>
              <TextInput Label='' style={{ width: '100%', padding: 5, margin: 15, marginTop: 20 }} multiline={true} numberOfLines={4} disabled={true} value={medicData?.libelle_atc_2} />


            <Button mode="contained" onPress={() => handleReport({ nom: medicData?.name, cip: medicData?.cip, message })} style={[styles.btnHelp, { marginBottom: 0, marginTop: 30, backgroundColor: "#8EC641" }]} disabled={isReportButtonClicked}>
              {t('saisieCode_button_report')}
            </Button>
            <Button mode="contained" onPress={hideReportModal} style={[styles.btnHelp, { marginBottom: -16, marginTop: 15 , backgroundColor: "#8EC641"}]}>
              {t('button_close')}
            </Button>
          </View>
          </TouchableWithoutFeedback>
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