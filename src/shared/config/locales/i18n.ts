import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';

import EN from './languages/en-us.json';

const resources = {
  en: {
    translation: EN,
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export default i18next;
