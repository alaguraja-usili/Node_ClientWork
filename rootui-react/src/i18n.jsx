/* eslint-disable */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./localization/translations/en_US.json";
import deTranslation from "./localization/translations/de.json";
import ruTranslation from "./localization/translations/ru.json";
import esTranslation from "./localization/translations/es.json";
import ptTranslation from "./localization/translations/pt-BR.json";
import zhCNTranslation from "./localization/translations/zh-Hans.json";
import csCZTranslation from "./localization/translations/cs.json";
import svTranslation from "./localization/translations/sv.json";
import trTranslation from "./localization/translations/tr.json";
import plTranslation from "./localization/translations/pl.json"
import frTranslation from "./localization/translations/fr.json";
import itTranslation from "./localization/translations/it.json";
import es419Translation from "./localization/translations/es-419.json"


// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
      translation: enTranslation,
    },
  ru: {
      translation: ruTranslation,
    },
  pt: {
      translation: ptTranslation,
    },
  zhCN: {
      translation: zhCNTranslation,
    },
  de: {
      translation: deTranslation,
    },
  es: {
      translation: esTranslation,
    },
  csCZ: {
      translation: csCZTranslation,
    },
  sv: {
      translation: svTranslation,
    },
  tr: {
    translation: trTranslation
  }, 
  pl: {
    translation: plTranslation
  },
  it: {
    translation: itTranslation
  },
  fr: {
    translation: frTranslation
  },
  es419: {
    translation: es419Translation
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;