import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import es from './es.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en.translation },
    es: { translation: es.translation }
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  compatibilityJSON: 'v3', // Use v3 format for better compatibility
});

export default i18n;
    