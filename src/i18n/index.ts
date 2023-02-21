import { Platform, NativeModules } from 'react-native';
import I18n from 'i18n-js';

/* Datetime Picker translations */
import {
  en as dEn,
  pt as dPt,
  registerTranslation,
} from 'react-native-paper-dates';

/* Translations files */
import en from './translations/en.json';
import pt from './translations/pt.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

/* Registering datetime picker translations */
registerTranslation('en', dEn);
registerTranslation('pt', dPt);

/* Function to get language on device */
export const getLanguageByDevice = () => {
  return Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale // iOS devices
    : NativeModules.I18nManager.localeIdentifier; // Android devices
};

/* Supported languages */
I18n.translations = { en, pt, es, fr };

/* Function to check if device language is supported, otherwise, sets 'en_US' as default */
const setLanguageToI18n = () => {
  const language = getLanguageByDevice();
  // eslint-disable-next-line
  // @ts-ignore-next-line: object formatting won't make use of strings, but keys are strings
  const translateNormalize = language.split('_')[0];
  const iHaveThisLanguage =
    I18n.translations.hasOwnProperty(translateNormalize);
  if (iHaveThisLanguage) I18n.locale = translateNormalize;
  else I18n.defaultLocale = 'en';
};

/* Calling the functio to get the language */
setLanguageToI18n();

/* Exporting default translation language */
export default (key: string) => I18n.t(key);
