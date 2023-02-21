import { DefaultTheme, DarkTheme } from 'react-native-paper';

/* App default theming */
export const AppDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

/* Cool Green Theme */
export const CoolGreenTheme = {
  ...DarkTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#43A047',
    secondary: '#A5D6A7',
    accent: '#1B5E20',
    background: '#2E7D32',
    surface: '#388E3C',
    backdrop: '#4A4D54',
    placeholder: '#C8E6C9',
    disabled: '#9ba3b0',
    text: '#ffffff',
    onSurface: '#ffffff',
    success: '#448D4C',
    successAccent: '#76FF03',
    error: '#FF1744',
    errorAccent: '#FF1943',
    warning: '#C8CB27',
    warningAccent: '#FFEA32',
    notification: '#7DD8FF',
    notificationBackdrop: '#357895',
  },
};
