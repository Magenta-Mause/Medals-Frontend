import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import germanTranslation from "./de-DE/translation.json";
import englishTranslation from "./en-US/translation.json";

const resources = {
  en: {
    translation: englishTranslation,
  },
  de: {
    translation: germanTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "de",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
