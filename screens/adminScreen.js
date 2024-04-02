// Choose your preferred renderer
// import { SkiaChart, SVGRenderer } from '@wuba/react-native-echarts';
import { SvgChart, SVGRenderer } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet,Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  BarChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components';

import { getDocs, collection, deleteDoc, doc} from 'firebase/firestore';
import db from '../db/firestore'; // Assurez-vous d'importer votre configuration de Firebase Firestore
import { Modal, Portal, Button, TextInput, Provider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';
import { useFocusEffect } from '@react-navigation/native';

// Register extensions
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
  // ...
  BarChart,
])

const E_HEIGHT = 250;
const E_WIDTH = Dimensions.get('window').width;

// Initialize
function ChartComponent({ option }) {
    const chartRef = useRef(null);
  
    useEffect(() => {
      let chart = null;
      if (chartRef.current) {
        chart = echarts.init(chartRef.current, 'light', {
          renderer: 'svg',
          width: E_WIDTH,
          height: E_HEIGHT,
        });
        chart.setOption(option);
      }
      return () => {
        if (chart) {
          chart.dispose();
        }
      };
    }, [option]);
  
    return <SvgChart ref={chartRef} style={{ marginBottom: 25 }} />;
  }
  



const generateChartData = (AdminReports) => {
    const reportCounts = new Map();
  
    AdminReports.forEach((AdminReports) => {
      const { medicament} = AdminReports;
      const upperCaseMedicament = medicament.toLowerCase(); 
      
      if (reportCounts.has(upperCaseMedicament)) {
        reportCounts.set(upperCaseMedicament, reportCounts.get(upperCaseMedicament) + 1);
      } else {
        reportCounts.set(upperCaseMedicament, 1);
      }
    });
  
    const data = Array.from(reportCounts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
    return data;
};
  
  



const AdminScreen = () => {
    const [AdminReports, SetAdminReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [value, setValue] = useState(null);
    const [isUserReportOpen, setIsUserReportOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
    const { t } = useTranslation();
    

        const fetchData = async () => {
          try {
            const isconnected = await NetInfo.fetch().then(state => state.isConnected);
            if (!isconnected) {
                const localReports = await AsyncStorage.getItem('AdminAllReport');
                const localUsers = await AsyncStorage.getItem('AdminAllUser');
                if (localReports) {
                    SetAdminReports(JSON.parse(localReports));
                }
                if (localUsers) {
                    setUsers(JSON.parse(localUsers));
                }
            
            }else{

                const reportQuerySnapshot = await getDocs(collection(db, 'report'));
                const fetchedReports = [];
                reportQuerySnapshot.forEach((doc) => {
                fetchedReports.push(doc.data());
                });
                SetAdminReports(fetchedReports);
        
                const userQuerySnapshot = await getDocs(collection(db, 'user'));
                const fetchedUsers = [];
                userQuerySnapshot.forEach((doc) => {
                const userData = doc.data();
                const selectedUserData = {
                    uuid: userData.uuid,
                    email: userData.email,
                    role: userData.role
                };
                fetchedUsers.push(selectedUserData);
                });
                setUsers(fetchedUsers);
                AsyncStorage.removeItem('AdminAllReport');
                AsyncStorage.removeItem('AdminAllUser');
                AsyncStorage.setItem('AdminAllReport', JSON.stringify(fetchedReports));
                AsyncStorage.setItem('AdminAllUser', JSON.stringify(fetchedUsers));
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

      useFocusEffect( useCallback(() => {
        fetchData();
      }, []));

      

  
    const chartData = generateChartData(AdminReports);
  
    const option = {
      xAxis: {
        type: 'category',
        data: chartData.map((item) => item.name),
        axisLabel: {
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: chartData.map((item) => item.value),
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
          },
          barWidth: '60%',
        },
      ],
    };
  


    return (
        <Provider>
            <View>
                <Text style={styles.title}> {t('admin_title')} </Text>

                <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginVertical: 20 }}>
                    <Button 
                        mode="contained"
                        onPress={() => setIsDropdownOpen(true)}
                        style={{ marginBottom: 10, width: 300, alignSelf: 'center', backgroundColor: "#8EC641" }}
                    >
                        {t('admin_selectUser')}
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => setIsGraphModalOpen(true)}
                        style={{ marginBottom: 10, width: 300, alignSelf: 'center', backgroundColor: "#8EC641" }}
                    >
                        {t('admin_graphique')}
                    </Button>
                </View>
            </View>

            <Portal>
              <Modal visible={isDropdownOpen} onDismiss={() => setIsDropdownOpen(false)}>
                <View style={styles.modalView}>
                <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom: 20 }}>{t('admin_selectUser_title')}</Text>
                <Dropdown
                    style={[styles.dropdown, isDropdownOpen && { borderColor: 'blue' }]}
                    data={users.map((user) => ({
                        label: user.email + ' - ' + user.role,
                        value: user.email,
                    }))}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isDropdownOpen ? 'Select item' : t('admin_selectUser_default')}
                    searchPlaceholder= {t('admin_selectUser_search')}
                    value={value}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                    onChange={(item) => {
                        setValue(item.value);
                        setIsDropdownOpen(false);
                        setIsUserReportOpen(true);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                        style={styles.icon}
                        color={isDropdownOpen ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                        />
                    )}
                />
                </View>
              </Modal>

              <Portal>
                <Modal visible={isUserReportOpen} onDismiss={() => setIsUserReportOpen(false)}>
                    <View style={{ ...styles.modalView, justifyContent: 'center', alignItems: 'center',height: '100%', }}>
                        <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom: 20 }}>{t('admin_selectUser_Modal_title')}</Text>
                        
                        {
                            AdminReports.filter((report) => report.email === value).length === 0 ? (
                                <Text style={{ fontSize: 16, marginBottom: 10 }}>{t('admin_selectUser_Modal_noReport')}</Text>
                            ) 
                            : 
                            (
                                <ScrollView>
                                    {AdminReports
                                    .filter((report) => report.email === value)
                                    .sort((a, b) => {
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
                                    })
                                    .map((report, index) => (
<TouchableOpacity 
    key={index}
    onPress={async () => {
        Alert.alert(
            `${t('admin_selectUser_Message_medicament')}: ${report.medicament}`,
            `Message: ${report.message}\n${t('admin_selectUser_Message_Date')}: ${report.date}`,
            [
                {
                    text: t('admin_selectUser_Message_delete'),
                    onPress: async () => {
                        console.log('Deleting report:', report.cip);

                        const isconnected = await NetInfo.fetch().then(state => state.isConnected);
    
                        if (!isconnected) {
                          alert(t('admin_selectUser_Message_noInternet'));
                          return;
                        }
                        const querySnapshot = await getDocs(collection(db, 'report'));
                        querySnapshot.forEach(async (doc) => {
                            const reportData = doc.data();
                            if (
                                reportData.cip === report.cip &&
                                reportData.email === report.email &&
                                reportData.date === report.date &&
                                reportData.message === report.message &&
                                reportData.medicament === report.medicament
                            ) {
                                await deleteDoc(doc.ref);
                                const newAdminReports = AdminReports.filter(
                                    (rep) =>
                                        rep.cip !== report.cip ||
                                        rep.email !== report.email ||
                                        rep.date !== report.date ||
                                        rep.message !== report.message ||
                                        rep.medicament !== report.medicament
                                );
                                SetAdminReports(newAdminReports);
                                AsyncStorage.setItem('AdminAllReport', JSON.stringify(newAdminReports));
                                alert(t('admin_selectUser_Message_delete'));
                            }
                        });
                    },
                },
                {
                    text: t('button_close'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    }}
>


                                        <View
                                            key={index}
                                            style={{
                                            marginBottom: 20,
                                            padding: 10,
                                            borderColor: 'black',
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, marginBottom: 10 }}>
                                            {`${t('admin_selectUser_Message_medicament')}: ${report.medicament}`}
                                            </Text>
                                            <Text style={{ fontSize: 16, marginBottom: 10 }}>
                                            {`Message: ${report.message}`}
                                            </Text>
                                            <Text style={{ fontSize: 16, marginBottom: 10 }}>
                                            {`${t('admin_selectUser_Message_Date')}: ${report.date}`}
                                            </Text>
                                        </View>
                                      </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )
                            }
                        <Button
                            mode="contained"
                            onPress={() => setIsUserReportOpen(false)}
                            style={{ marginTop: 15,marginBottom: 0, width: 100, alignSelf: 'center' , backgroundColor: "#8EC641"}}
                        >
                            {t('button_close')}
                        </Button>
                    </View>
                </Modal>
              </Portal>

              
              <Modal visible={isGraphModalOpen} onDismiss={() => setIsGraphModalOpen(false)}>
                <View style={{ ...styles.modalViewGraphique, padding: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20,marginTop: 20 }}>{t('admin_stats_title')}</Text>
                    <ChartComponent option={option}  />
                    <Button
                        mode="contained"
                        onPress={() => setIsGraphModalOpen(false)}
                        style={{ marginBottom: 20, width: 100, alignSelf: 'center', backgroundColor: "#8EC641" }}
                    >
                            {t('button_close')}
                    </Button>
                </View>
              </Modal>
            </Portal>

        </Provider>
      );
    }
  
  const styles = StyleSheet.create({
    title: {
        padding: 20,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdown: {
      height: 50,
      width: 300,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
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
    modalViewGraphique: {
        backgroundColor: 'white',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
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
  
  export default AdminScreen;