/* Needed import on app's first file */
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { View, StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper';

import AppProvider from './hooks';
import { CoolGreenTheme as theme } from './themes';

import Routes from './routes/index';

LogBox.ignoreLogs([
  /* Ignoring Reanimated 2 and EventEmitter warning logs, dependencies might throw it as of versions mismatch */
  'Reanimated 2',
  'EventEmitter',
  /* We'll also ignore Logs about headless tasks for RNFirebase: https://rnfirebase.io/messaging/usage#background-application-state */
  'ReactNativeFirebaseMessagingHeadlessTask',
  /* ViewPropTypes (since react-native-camera and react-native-qrcode-scanner) */
  'ViewPropTypes',
]);

/* App's main component */
const App: React.FC = () => {
  useEffect(() => {
    /* Here we can check if there's a valid token for the user, among other things */
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      {/* Theming */}
      <PaperProvider theme={theme}>
        {/* Application's StatusBar */}
        <StatusBar
          backgroundColor={theme.colors.primary}
          /* This option makes with that Android does not count status bar as content size
          we do this in order to avoid having to use following code on all screens:
          padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px; */
          translucent
        />
        {/* App Context */}
        <AppProvider>
          {/* App main screen */}
          <View style={{ flex: 1 }}>
            <Routes />
          </View>
        </AppProvider>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
