import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Alert,TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import data from '../assets/json/medic.json';
import { AuthContext } from '../context/AuthContext';
import {addDoc, collection } from 'firebase/firestore';
import db from '../db/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { fetchReports } from './mesreportScreen';
import 'intl-pluralrules';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { KeyboardAvoidingView } from 'react-native';

const SaisieCodeScreen = () => {
  const [visible, setVisible] = useState(false);
  const [cipValue, setCipValue] = useState();
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isReportButtonClicked, setIsReportButtonClicked] = useState(false);
  const [medicData, setMedicData] = useState(null);
  const [message, setMessage] = useState('');
  const {email, setReport} = useContext(AuthContext);
  const { t } = useTranslation();


  const showHelpModal = () => setVisible(true);
  const hideHelpModal = () => setVisible(false);

  const showReportModal = () => setReportModalVisible(true);
  const hideReportModal = () => setReportModalVisible(false);

  const extraireNom = (value) => {
    const newdata = data["medic"];
    let codecip;
    let valuetostring = value.toString();
  
    if (valuetostring.length < 13 || valuetostring.length > 14) {
      return null;
    }

    if (value.length != 13) {
      codecip = parseInt(valuetostring.slice(1, 14), 10);
    }

    for (let i = 0; i < newdata.length; i++) {
      if (value == newdata[i].cip13) {
        return newdata[i].nom_court.toLowerCase();
      }
    }
    return null;
  };
  
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
  
  const checkmedic = (value) => {
    const CipCode = parseInt(value,10);
  
    if (!CipCode) { 
      Alert.alert(t('error'), t('saisieCode_error_cip'));
      return;
    }
  
    const medicname = extraireNom(CipCode);
    const medicdetaille = extraireDetaille(CipCode);
    if (!medicname) {
      Alert.alert(t('error'), t('saisieCode_error_cip'));
      return;
    }
  
    setMedicData({ cip: CipCode, name: medicname, detaille: medicdetaille});
    Alert.alert(
      t('saisieCode_alert_title1'),
      `\n Code CIP : `+CipCode+
      `\n\n${t('saisieCode_medicname')}: `+medicname
      +`\n\n${t('qrcode_alert_detail')}:\n `+medicdetaille
      ,
      [
        {
          text: t('saisieCode_button_report'),
          onPress:showReportModal,
        },
        {
          text: t('saisieCode_button_cancel'),
          onPress: () => setCipValue(''),
        },
      ],
      { cancelable: false }
    );
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
          setCipValue('');
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
        setCipValue('');
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
  return (
    <Provider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <TextInput
            mode="outlined"
            label="Code CIP"
            placeholder={t('saisieCode_placeholder_cip')}
            style={{width: 300, marginBottom: 20}}
            value={cipValue}
            onChangeText={text => setCipValue(text)}
            keyboardType="numeric"
          />

          <Button
            mode="contained"
            onPress={() => checkmedic(cipValue)}
            style={[styles.button, {backgroundColor: "#8EC641"}]}
          >
            {t('saisieCode_button_validate')}
          </Button>

        </View>
      </TouchableWithoutFeedback>
      
      <View style={{flex: 1, justifyContent: 'flex-end'}}>

        <Button
          mode="contained"
          onPress={() => showHelpModal()}
          style={[styles.btnHelp,{backgroundColor: "#8EC641"}]}
        >
          {t('saisieCode_button_help')}
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
              {t('saisieCode_help_text')}
            </Text>

            <Button
              mode="contained"
              onPress={() => hideHelpModal()}
              style={[styles.btnHelp, {marginBottom: -16,marginTop: 30, backgroundColor: "#8EC641"}]}
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
              {t('saisieCode_report_title')}
            </Text>

              <TextInput label={t('saisieCode_medicname')} style={{ width: '100%', padding: 5}} multiline={true} numberOfLines={4} disabled={true} value={medicData?.name} />
              <TextInput label="Code CIP" style={{ width: '100%', padding: 5, margin: 15 }} disabled={true} value={medicData?.cip.toString()} />
              <TextInput label={t('saisieCode_problem')} style={{ width: '100%', padding: 5 }} multiline={true} numberOfLines={4} onChangeText={setMessage} />
              <Text style={{ marginTop: 325,paddingRight:110, fontSize: 12, position: 'absolute' }}> {t('qrcode_alert_detail')} :</Text>
              <TextInput Label='' style={{ width: '100%', padding: 5, margin: 15, marginTop: 20 }} multiline={true} numberOfLines={4} disabled={true} value={medicData?.detaille} />


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
