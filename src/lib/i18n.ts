import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
.use(Backend)
  .use(initReactI18next) 
  .init({
    fallbackLng: 'en',
    debug: false, 
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    lng:"en",
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
