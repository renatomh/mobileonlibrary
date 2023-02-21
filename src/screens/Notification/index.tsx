import React, { useCallback, useState } from 'react';

import { FAB } from 'react-native-paper';
/* eslint-disable-next-line */
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import IconButton from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

/* Internationalization */
import t from '../../i18n';

/* Components */
import InfoSnackbar from '../../components/InfoSnackbar';

import { CoolGreenTheme as theme } from '../../themes';
import {
  Container,
  AreaContainer,
  LoadingIcon,
  Title,
  Description,
  DeliveryTime,
} from './styles';

import { Notification as Item } from '../../models/notification/notification';

/* API hook */
import { useApiCrud } from '../../hooks/apiCrud';
import { useAppData } from '../../hooks/appData';

/* API communication */
import api from '../../services/api';

/* Route params interface */
interface RouteParams {
  notificationId: number;
}

const Notification: React.FC = () => {
  const route = useRoute();
  const { notificationId } = route.params as RouteParams;
  const { loading } = useApiCrud();
  const { setOptions, navigate } = useNavigation();
  const {
    snackbarText,
    snackbarType,
    snackbarVisible,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  } = useAppData();

  const [notification, setNotification] = useState<Item | null>(null);

  /* Function to handle navigating to a specific route screen */
  const handleNavigateToRoute = useCallback(() => {
    /* If a mobile action was provided for the notification */
    if (notification?.mobile_action) {
      /* If user should be redirected for an item */
      if (/Book:{bookId:(.*)}/g.test(notification?.mobile_action)) {
        /* Getting book ID to navigate */
        try {
          /* Defining the regular expression to get the item ID */
          const regex = /Book:{bookId:(.*)}/g;
          const regexRes = regex.exec(notification?.mobile_action);
          /* If it was possible to retrieve the item's ID */
          if (regexRes) {
            const bookId = parseInt(regexRes[1], 10);
            navigate('Book', { bookId });
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      }
    }
  }, [notification?.mobile_action, navigate]);

  const handleDeleteNotification = useCallback(async () => {
    /* Calling the API route to delete the notification */
    const response = await api.delete(`/notifications/${notificationId}/my`);
    /* If there was en error */
    if (response.status !== 204) {
      /* We inform the user about the error */
      setSnackbarText(
        `${t('Error while deleting the notification')}: ${
          response.data.meta.errors
        }`,
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
    /* Otherwise, if response was successful, we return to the notifications page */
    navigate('Notifications');
  }, [
    notificationId,
    navigate,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  ]);

  /* Function to handle notification reading/unreading */
  const setReadNotification = useCallback(
    async (notification: Item): Promise<void> => {
      /* Checking if current notification is already read or not */
      let readData = 1;
      if (notification.is_read === 1) readData = 0;
      /* Calling the API route to update notification's read status */
      const response = await api.patch(
        `/notifications/${notification.id}/read`,
        { is_read: readData },
      );
      /* If there was en error */
      if (!response.data.meta.success) {
        /* We inform the user about the error */
        setSnackbarText(
          `${t('Error while reading the notification')}: ${
            response.data.meta.errors
          }`,
        );
        setSnackbarType('error');
        setSnackbarVisible(true);
      }
      /* Otherwise, if response was successful */
    },
    [setSnackbarText, setSnackbarType, setSnackbarVisible],
  );

  /* Function to load selected notification */
  const loadNotification = useCallback(async () => {
    const response: any = await api.get(`/notifications/${notificationId}`);

    if (response.data.meta.success) {
      /* Setting the selected notifications */
      setNotification(response.data.data);
      /* Setting notification as read */
      setReadNotification(response.data.data);
    }
  }, [notificationId, setReadNotification]);

  /* This is similar to a 'useEffect', but it loads whenever route is focused */
  useFocusEffect(
    useCallback(() => {
      /* Getting data related to the notification */
      loadNotification();

      /* Updatng the main tab name */
      setOptions({
        title: t('Notification'),
        headerRight: () =>
          // Currently, we're not allowing items to be deleted
          false && (
            <IconButton
              style={{ marginRight: 12 }}
              color="white"
              name="trash-can-outline"
              size={24}
              onPress={() => {
                handleDeleteNotification();
              }}
            />
          ),
      });
      /* ... */
      setSnackbarText('');
    }, [
      setSnackbarText,
      loadNotification,
      handleDeleteNotification,
      setOptions,
    ]),
  );

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      {loading && (
        <LoadingIcon size="large" color={theme.colors.notification} />
      )}

      {/* Showing items if not loading */}
      {!loading && (
        <>
          <Title>{notification?.title}</Title>
          <AreaContainer>
            <Description>{notification?.description}</Description>
            <DeliveryTime>
              {t('Delivered at')}
              {': '}
              {notification?.created_at
                ? format(
                    new Date(
                      `${notification.created_at.slice(
                        0,
                        22,
                      )}:${notification.created_at.slice(22)}`,
                    ),
                    'dd/MM/yyyy HH:mm:ss',
                  )
                : '-'}
            </DeliveryTime>
          </AreaContainer>
        </>
      )}
      <FAB
        icon="open-in-new"
        onPress={handleNavigateToRoute}
        color={theme.colors.onSurface}
        visible={notification?.mobile_action !== null}
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.notification,
        }}
      />
      {
        /* Using this render avoids possibly breaking other views */
        snackbarVisible && (
          <InfoSnackbar
            text={snackbarText}
            duration={5000}
            type={snackbarType}
            onCustomDismiss={() => setSnackbarVisible(false)}
          />
        )
      }
    </Container>
  );
};

export default Notification;
