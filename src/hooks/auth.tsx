import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

/* API communication */
import api from '../services/api';

import { Response } from './apiCrud';

import { User } from '../models/users/user';

/* Auth state typing */
interface AuthState {
  token: string;
  user: User;
}

/* Credentials typing */
interface SignInCredentials {
  username: string;
  password: string;
}

/* Auth context typing */
interface AuthContextData {
  user: User;
  token: string;
  loading: boolean;
  /* Context methods */
  signIn(credentials: SignInCredentials): Promise<Response>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

/* Creating and initializing the user auth context */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/* Creating Auth Provider */
const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Async storage data loading */
    async function loadStoragedData(): Promise<void> {
      /* Initializing daat with local stored values */
      const [token, user] = await AsyncStorage.multiGet([
        '@mobileonlibrary:token',
        '@mobileonlibrary:user',
      ]);

      /* 'multiGet' retorns data key and value */
      if (token[1] && user[1]) {
        /* Setting default headers with returned token */
        if (api.defaults.headers)
          api.defaults.headers.common.Authorization = `Bearer ${token[1]}`;

        setData({
          token: token[1],
          user: JSON.parse(user[1]),
        });
      }

      setLoading(false);
    }

    /* Loading storage data */
    loadStoragedData();
  }, []);

  /* API login function */
  const signIn = useCallback(
    async (data: SignInCredentials): Promise<Response> => {
      const response: any = await api.post('/auth/login', data);
      if (response.data.meta.success) {
        /* Getting data returned from API */
        const user = response.data.data;
        const { token } = user;

        /* Saving data on local storage */
        await AsyncStorage.setItem('@mobileonlibrary:token', token);
        await AsyncStorage.setItem(
          '@mobileonlibrary:user',
          JSON.stringify(user),
        );
        /* If we were to use 'multiSet' */
        // await AsyncStorage.multiSet([
        //   ['@mobileonlibrary:token', token],
        //   ['@mobileonlibrary:user', JSON.stringify(user)]
        // ]);

        /* Setting default headers with returned token */
        if (api.defaults.headers)
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

        /* Saving data on auth context */
        setData({ token, user });

        /* We'll also check if a FCM token is available */
        const fcmToken = await AsyncStorage.getItem(
          '@mobileonlibrary:fcmToken',
        );
        /* If it is, we'll set the user's FCM token on the API */
        if (fcmToken)
          await api.patch(`/users/my/fcm-token`, { fcm_token: fcmToken });
      }

      return response.data;
    },
    [],
  );

  /* Logout function */
  const signOut = useCallback(async () => {
    /* Removing stored data */
    await AsyncStorage.multiRemove([
      '@mobileonlibrary:token',
      '@mobileonlibrary:user',
    ]);

    /* Updating auth context */
    setData({} as AuthState);
  }, []);

  /* Update user function */
  /* We could receive only some parameters from 'User' using 'Partial<User>' */
  const updateUser = useCallback(
    async (user: User) => {
      /* Saving local data */
      await AsyncStorage.setItem('@mobileonlibrary:user', JSON.stringify(user));

      /* Updating auth user data */
      setData({
        /* Keeping the token */
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    /* Exporting context properties and methods */
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        loading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* Using the auth context */
function useAuth(): AuthContextData {
  /* Defining context to be used */
  const context = useContext(AuthContext);
  /* Checking if it was created */
  if (!context) {
    /* Must be used on 'App.tsx' */
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
