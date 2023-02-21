import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

/* Notification state typing */
interface NotificationState {
  fcmToken: string | null;
}

/* Notification context typing */
interface NotificationContextData {
  fcmToken: string | null;
}

/* Creating and initializing the notification context */
const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData,
);

/* Creating Notification Provider */
const NotificationProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<NotificationState>({} as NotificationState);

  /* Function to check and set FCM notification token */
  const checkToken = async () => {
    /* Trying to get the FCM token */
    const fcmToken = await messaging().getToken();
    /* If item was found, we'll store it on the local storage */
    if (fcmToken)
      await AsyncStorage.setItem('@mobileonlibrary:fcmToken', fcmToken);
  };

  useEffect(() => {
    /* Async storage data loading */
    async function loadStoragedData(): Promise<void> {
      /* Initializing daat with local stored values */
      const fcmToken = await AsyncStorage.getItem('@mobileonlibrary:fcmToken');

      /* If FCM token was found */
      if (fcmToken) {
        /* Setting default FCM token */
        setData({ fcmToken });
      }

      /* Otherwise, we'll check for it */
      checkToken();
    }

    /* Loading storage data */
    loadStoragedData();

    /* Listening to background messages */
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      /* eslint-disable-next-line */
      console.log('New FCM Message handled in background!', remoteMessage);
    });

    /* Listening to foreground messages (won't be displayed on notification status bar) */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      /* eslint-disable-next-line */
      console.log('New FCM message', remoteMessage);
      if (
        remoteMessage.notification?.title &&
        remoteMessage.notification?.title
      ) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
        );
      }
    });

    /* Returning the foreground listener */
    return unsubscribe;
  }, []);

  return (
    /* Exporting context properties and methods */
    <NotificationContext.Provider
      value={{
        fcmToken: data.fcmToken,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* Using the notification context */
function useNotification(): NotificationContextData {
  /* Defining context to be used */
  const context = useContext(NotificationContext);
  /* Checking if it was created */
  if (!context) {
    /* Must be used on 'App.tsx' */
    throw new Error(
      'useNotification must be used within an NotificationProvider',
    );
  }
  return context;
}

export { NotificationProvider, useNotification };
