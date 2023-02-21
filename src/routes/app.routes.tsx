import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Books from '../screens/Books';
import Book from '../screens/Book';
import Notifications from '../screens/Notifications';
import Notification from '../screens/Notification';

import DrawerComponent from '../components/DrawerComponent';

import { CoolGreenTheme as theme } from '../themes';

/* Auth hook */
import { useAuth } from '../hooks/auth';

const App = createDrawerNavigator();

/* Auth user routes */
const AppRoutes: React.FC = () => {
  /* Getting current logged in user */
  const { user } = useAuth();

  return (
    /* Creating the screens navigator */
    <App.Navigator
      screenOptions={{
        /* Showing the header */
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        /* This style will be used for a visual feedback wehn user has unread notifications */
        headerLeftContainerStyle: {
          borderTopWidth: 4,
          borderTopColor: theme.colors.surface,
          borderBottomWidth: 4,
          borderBottomColor:
            user.unread_notifications_count > 0
              ? theme.colors.notification
              : theme.colors.surface,
        },
      }}
      drawerContent={(props: any) => <DrawerComponent {...props} />}
    >
      <App.Screen name="Home" component={Home} />
      <App.Screen name="Profile" component={Profile} />
      <App.Screen name="Books" component={Books} />
      <App.Screen name="Book" component={Book} />
      <App.Screen name="Notifications" component={Notifications} />
      <App.Screen name="Notification" component={Notification} />
    </App.Navigator>
  );
};
export default AppRoutes;
