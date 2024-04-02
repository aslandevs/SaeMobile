import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../languages/i18n';

const ProfilScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);

    

    const logouut = () => {
        navigation.navigate('Logout');
    }


  return (
    <View style={styles.container}>
      {/* Contenu de votre écran de profil */}
      <Button mode="contained" style={{ margin: 10, width: 200, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={logouut}>
        {t('profile_logout')}
      </Button>
      <Dropdown
        style={[styles.dropdown, isDropdownOpen && { borderColor: 'blue' }]}
        data={[{ label: t('profile_french'), value: 'fr' }, { label: t('profile_english'), value: 'en' }]}
        labelField="label"
        valueField="value"
        placeholder={!isDropdownOpen ? t('profile_selectLanguage') : t('profile_selectLanguage')}
        value={value}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setIsDropdownOpen(false)}
        onChange={(item) => {
            setValue(item.value);
            setIsDropdownOpen(false);
            AsyncStorage.setItem('lang', item.value);
            i18n.changeLanguage(item.value);
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
  );
};

const styles = StyleSheet.create({
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
});

export default ProfilScreen;
