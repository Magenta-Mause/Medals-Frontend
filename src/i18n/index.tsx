import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import germanTranslation from "./de-DE/translation.json";
import englishTranslation from "./en-US/translation.json";
import spanishTranslation from "./es-ES/translation.json";
import frenchTranslation from "./fr-FR/translation.json";
import dutchTranslation from "./nl-NL/translation.json";

const resources = {
  en: {
    translation: englishTranslation,
  },
  de: {
    translation: germanTranslation,
  },
  es: {
    translation: spanishTranslation,
  },
  fr: {
    translation: frenchTranslation,
  },
  nl: {
    translation: dutchTranslation,
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
