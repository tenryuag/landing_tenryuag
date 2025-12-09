import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      ja: { translation: ja },
    },
    fallbackLng: 'es', // Idioma por defecto
    debug: false,
    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },
    detection: {
      // Orden de detección: localStorage > navegador
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Guarda la preferencia del usuario
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
