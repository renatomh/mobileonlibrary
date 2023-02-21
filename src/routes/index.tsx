import React from 'react';
import { View, ActivityIndicator } from 'react-native';

/* Auth and app routes */
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { CoolGreenTheme as theme } from '../themes';

/* Auth hook */
import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  /* Getting current logged in user */
  const { user, loading } = useAuth();

  /* Checking if it's loading the user */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.notification} />
      </View>
    );
  }

  /* Selecting routes according to user logged in or not */
  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
