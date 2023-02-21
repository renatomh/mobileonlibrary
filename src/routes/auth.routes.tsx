import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../screens/SignIn';

import { CoolGreenTheme as theme } from '../themes';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  /* Screen navigator */
  <Auth.Navigator
    screenOptions={{
      /* Hiding the header */
      headerShown: false,
      /* Background color */
      headerStyle: { backgroundColor: theme.colors.primary },
      cardStyle: { backgroundColor: theme.colors.primary },
    }}
  >
    <Auth.Screen name="SignIn" component={SignIn} />
  </Auth.Navigator>
);

export default AuthRoutes;
