import React, { useContext, useState, useEffect, useCallback  } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import {getDocs, query, collection, onSnapshot  } from 'firebase/firestore';
import db from '../db/firestore';

const MesReportScreen = () => {
    const {email} = useContext(AuthContext);

    const [reports, setReports] = useState([]);

    const fetchReports = useCallback(async () => {
        try {
          const snapshot = await getDocs(query(collection(db, 'report')));
          const fetchedReports = [];
          snapshot.forEach((doc) => {
            if (doc.data().email === email) {
              fetchedReports.push(doc.data());
            }
          });
          setReports(fetchedReports);
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      }, [email]);
    
      useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'report'), () => {
          fetchReports();
        });
        return () => unsubscribe();
      }, [fetchReports]);

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>Mes Signalements</Text>

        <FlatList style={{marginTop: 20}}
            data={reports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.content}>
                <Text style={styles.text}>CIP: {item.cip}</Text>
                <Text style={styles.text}>Médicament: {item.medicament}</Text>
                <Text style={styles.text}>Message: {item.message}</Text>
                <Text style={styles.text}>Date: {item.date}</Text>
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
      }
      
  });

export default MesReportScreen;
