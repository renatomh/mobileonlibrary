import axios from 'axios';
import { Platform, NativeModules } from 'react-native';

/* Function to get language on device */
const getLanguageByDevice = () => {
  const language =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale // iOS devices
      : NativeModules.I18nManager.localeIdentifier; // Android devices
  // Here, we get only the main ifor abou the language code (ignoring '_US', '_BR', etc.)
  return language.split('_')[0];
};

const api = axios.create({
  /* Modify regarding the server address and device being used (Android emulator, iOS emulator, etc.) */
  // baseURL: 'http://10.0.2.2:8080',
  baseURL: 'https://onlibrary.mhsw.com.br',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': getLanguageByDevice(),
    'User-Agent': 'mobileonlibrary',
  },
  validateStatus: status => {
    return status >= 200 && status < 500;
  },
});

export default api;
