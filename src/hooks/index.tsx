import React from 'react';

/* Importing app contexts */
import { NotificationProvider } from './notification';
import { AuthProvider } from './auth';
import { ApiCrudProvider } from './apiCrud';
import { AppDataProvider } from './appData';

/* Providing hooks */
const AppProvider: React.FC = ({ children }) => {
  return (
    /* Config context */
    <NotificationProvider>
      <AuthProvider>
        <ApiCrudProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </ApiCrudProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default AppProvider;
