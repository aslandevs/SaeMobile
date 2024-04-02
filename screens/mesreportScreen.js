import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getDocs, query, collection, onSnapshot, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/firestore';
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';

export const fetchReports = async ({email, setReport}) => {
  const isConnected = await NetInfo.fetch().then(state => state.isConnected);
  
  if (!isConnected) {
    AsyncStorage.getItem('reports').then((localReports) => {
      if (localReports !== null) {
        console.log('localReports', JSON.parse(localReports));
        setReport(JSON.parse(localReports));
      }
    });
  } else {
    try {
      const snapshot = await getDocs(query(collection(db, 'report')));
      const fetchedReports = [];
      snapshot.forEach((doc) => {
        if (doc.data().email === email) {
          fetchedReports.push(doc.data());
        }
      });
      setReport(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  }
};


const synchronizeReports = async ({t}) => {
    const localReports = await AsyncStorage.getItem('reports');
    if (localReports) {
      const reportsArray = JSON.parse(localReports);
      if (reportsArray && reportsArray.length > 0) {
        try {
          const promises = reportsArray.map(async (report) => {
            await addDoc(collection(db, 'report'), report);
          });
          await Promise.all(promises);
  
          await AsyncStorage.removeItem('reports');
          alert(t('report_syncSuccess'));
        } catch (error) {
          console.error('Erreur lors de la synchronisation des reports:', error);
        }
      } else {
        console.log("Aucun report local à synchroniser.");
      }
    }
  };
  


const MesReportScreen = () => {
  const { email, report, setReport } = useContext(AuthContext);
  const { t } = useTranslation();

  const loadDataAndSynchronize = async () => {
    const isConnected = await NetInfo.fetch().then(state => state.isConnected);
    if (isConnected) {
      await synchronizeReports({t});
      fetchReports({ email, setReport});
    } else {
      fetchReports({ email, setReport});
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDataAndSynchronize();
    }, [email, setReport])
  );

  const sortedReports = report && Array.isArray(report) ? report.sort((a, b) => {
    const dateA = new Date(
      parseInt(a.date.split('/')[2]),
      parseInt(a.date.split('/')[0]) - 1,
      parseInt(a.date.split('/')[1]),
      parseInt(a.date.split(' ')[1].split(':')[0]),
      parseInt(a.date.split(' ')[1].split(':')[1]),
      parseInt(a.date.split(' ')[1].split(':')[2])
    );
    const dateB = new Date(
      parseInt(b.date.split('/')[2]), 
      parseInt(b.date.split('/')[0]) - 1,
      parseInt(b.date.split('/')[1]), 
      parseInt(b.date.split(' ')[1].split(':')[0]), 
      parseInt(b.date.split(' ')[1].split(':')[1]),  
      parseInt(b.date.split(' ')[1].split(':')[2]) 
    );
    return dateB - dateA;
  }) : [];


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ marginTop: 20 }}
        data={sortedReports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <Text style={styles.text}>CIP: {item.cip}</Text>
            <Text style={styles.text}>{t('admin_selectUser_Message_medicament')}: {item.medicament}</Text>
            <Text style={styles.text}>Message: {item.message}</Text>
            <Text style={styles.text}>{t('admin_selectUser_Message_Date')}: {item.date}</Text>
          </View>
        )}
      />
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
  content: {
    marginTop: 15,
    marginHorizontal: 20,
    borderColor: 'black',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MesReportScreen;
