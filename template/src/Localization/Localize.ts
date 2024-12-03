import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import es from './es.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {en: en, es: es},
  lng: 'en', // Default language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
    