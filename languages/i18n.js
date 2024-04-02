import i18next from 'i18next';
import fr from './fr_langage.json';
import en from './en_langage.json';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initializeI18next = async () => {
    const lang = (await AsyncStorage.getItem('lang')) ?? 'fr';
    await i18next
      .use(initReactI18next)
      .init({
        lng: lang,
        resources: {
          fr: fr,
          en: en
        },
        react: {
          useSuspense: false,
        },
      });
  };

initializeI18next();


export default i18next;