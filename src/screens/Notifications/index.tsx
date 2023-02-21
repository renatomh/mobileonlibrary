import React, { useCallback, useState } from 'react';

import { FlatList, RefreshControl, Dimensions } from 'react-native';
import { Searchbar, Portal, Dialog, Button } from 'react-native-paper';
/* eslint-disable-next-line */
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import IconButton from 'react-native-vector-icons/MaterialIcons';

/* Internationalization */
import t from '../../i18n';

/* Components */
import NotificationCard from '../../components/NotificationCard';
import EmptyList from '../../components/EmptyList';
import InfoSnackbar from '../../components/InfoSnackbar';

import { CoolGreenTheme as theme } from '../../themes';

import {
  Container,
  HeaderContainer,
  LoadingIcon,
  NotificationListContainer,
  DialogItemsList,
  DialogItemsText,
} from './styles';

import { useAuth } from '../../hooks/auth';

import { Notification } from '../../models/notification/notification';

/* API communication */
import { useApiCrud, Response } from '../../hooks/apiCrud';
import { useAppData } from '../../hooks/appData';

/* API communication */
import api from '../../services/api';

const Notifications: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { loading, loadCrudData } = useApiCrud();
  const { setOptions, navigate } = useNavigation();
  const {
    snackbarText,
    snackbarType,
    snackbarVisible,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  } = useAppData();

  const [notifications, setNotifications] = useState<Notification[]>(
    [] as Notification[],
  );

  const [notificationsFilter, setNotificationsFilter] = useState<
    'all' | 'read' | 'unread'
  >('unread');
  const [openNotificationsFilterModal, setOpenNotificationsFilterModal] =
    useState(false);

  /* API pagination states */
  const [queryText, setQueryText] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [itemsCount, setItemsCount] = useState(0);

  /* State to detect left and right swipes movements */
  const [touchX, setTouchX] = useState(0);
  const [paginationInstructionFlag, setPaginationInstructionFlag] =
    useState(false);

  /* Function to get user's unread notifications count */
  const loadUserUnreadNotifications = useCallback(
    async (): Promise<void> => {
      const response: any = await api.get(`/profile`);
      if (response.data.meta.success) {
        /* Getting data returned from API */
        const { unread_notifications_count } = response.data.data;
        /* Updating current user */
        updateUser({ ...user, unread_notifications_count });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* Function to load notifications data */
  const loadNotifications = useCallback(
    async (queryTextFilter = ''): Promise<void> => {
      const response: any = await loadCrudData({
        route: `/notifications/my`,
        page,
        limit,
        sort: [{ property: 'created_at', direction: 'desc' }],
        filter: [
          {
            property: 'title',
            value: queryTextFilter,
            anyMatch: true,
            joinOn: 'or',
            operator: 'like',
          },
          {
            property: 'description',
            value: queryTextFilter,
            anyMatch: true,
            joinOn: 'or',
            operator: 'like',
          },
          {
            property: 'is_read',
            value:
              notificationsFilter === 'all'
                ? '[0, 1]'
                : notificationsFilter === 'read'
                ? '[1]'
                : '[0]',
            anyMatch: true,
            joinOn: 'and',
            operator: 'in',
          },
        ],
      });

      if (response.meta.success) {
        /* Getting data returned from API */
        const userNotifications = response.data;
        /* Setting the user's notifications */
        setNotifications(userNotifications);
        /* And the items count */
        setItemsCount(response.meta.count);
        /* And update he user's unread notifications count */
        loadUserUnreadNotifications();
      }
    },
    [
      loadCrudData,
      page,
      limit,
      notificationsFilter,
      loadUserUnreadNotifications,
    ],
  );

  /* Function to handle notification reading/unreading */
  const setReadNotification = useCallback(
    async (notification: Notification): Promise<void> => {
      /* Checking if current notification is already read or not */
      let readData = 1;
      if (notification.is_read === 1) readData = 0;
      /* Calling the API route to update notification's read status */
      const response: Response = await api.patch(
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
      if (response.data.meta.success) {
        /* We reload the items */
        loadNotifications();
        /* And update he user's unread notifications count */
        loadUserUnreadNotifications();
      }
    },
    [
      loadNotifications,
      loadUserUnreadNotifications,
      setSnackbarText,
      setSnackbarType,
      setSnackbarVisible,
    ],
  );

  /* This is similar to a 'useEffect', but it loads whenever route is focused */
  useFocusEffect(
    useCallback(() => {
      /* Loading the notifications */
      loadNotifications();

      /* Updatng the main tab name */
      setOptions({
        title: t('Notifications'),
        headerRight: () => (
          <IconButton
            style={{ marginRight: 12 }}
            color="white"
            name="filter-list"
            size={24}
            onPress={() => {
              /* Here we will open a modal to apply filters to the service orders query */
              /* TODO: create filters modal */
              /* eslint-disable-next-line */
              setOpenNotificationsFilterModal(true);
            }}
          />
        ),
      });
      /* Initializing the 'limit', to avoid eslint errors */
      setLimit(10);
      /* For now, we don't want to update every time the user types */
      /* eslint-disable-next-line */
  }, [loadNotifications]));

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      <HeaderContainer>
        <Searchbar
          theme={theme}
          value={queryText}
          placeholder={t('Search notifications')}
          onChangeText={setQueryText}
          onIconPress={() => {
            loadNotifications(queryText);
          }}
          onEndEditing={() => {
            loadNotifications(queryText);
          }}
        />
      </HeaderContainer>

      <Portal>
        <Dialog
          visible={openNotificationsFilterModal}
          onDismiss={() => {
            setOpenNotificationsFilterModal(false);
          }}
          dismissable={false}
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
          }}
        >
          <Dialog.Title>{t('View Notifications')}</Dialog.Title>
          <Dialog.ScrollArea
            /* This is required, otherwise the list view could break the dialog view */
            style={{ maxHeight: Dimensions.get('window').height / 2 }}
          >
            <FlatList
              data={[
                { key: 'unread', value: t('Unread') },
                { key: 'read', value: t('Read') },
                { key: 'all', value: t('All') },
              ]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: {
                key: 'all' | 'read' | 'unread';
                value: string;
              }) => item.key}
              renderItem={({ item }) => {
                return (
                  <DialogItemsList
                    onPress={() => {
                      setNotificationsFilter(item.key);
                      setOpenNotificationsFilterModal(false);
                    }}
                    style={{
                      backgroundColor:
                        notificationsFilter === item.key
                          ? theme.colors.accent
                          : theme.colors.primary,
                    }}
                  >
                    <DialogItemsText>{item.value}</DialogItemsText>
                  </DialogItemsList>
                );
              }}
            />
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setOpenNotificationsFilterModal(false);
              }}
              color={theme.colors.onSurface}
            >
              {t('Cancel')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {loading && (
        <LoadingIcon size="large" color={theme.colors.notification} />
      )}

      {/* Showing list items if not loading */}
      {!loading && (
        <NotificationListContainer
          /* Checking for swipes */
          onTouchStart={e => setTouchX(e.nativeEvent.pageX)}
          onTouchEnd={e => {
            /* If the user swipes left */
            if (touchX - e.nativeEvent.pageX > 20) {
              /* We'll go to the next page, if not already in the last one */
              if (page < Math.ceil(itemsCount / limit)) setPage(page + 1);
            } else if (touchX - e.nativeEvent.pageX < -20) {
              /* If the user swipes right */
              /* We'll go to the previous page, if not already in the first one */
              if (page > 1) setPage(page - 1);
            }
          }}
        >
          <FlatList
            data={notifications}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: Notification) => item.id.toString()}
            ListEmptyComponent={EmptyList}
            // Required to avoid cropping last itme
            // Ref: https://stackoverflow.com/questions/46196242/react-native-flatlist-last-item-visibility-issue
            // In this case, we use 'margin-bottom' double of 'ItemContainer'
            contentContainerStyle={{ paddingBottom: 16 }}
            style={{ marginBottom: 64 }}
            /* When user has reached end of List View, we'll inform about pagination */
            onEndReached={() => {
              /* We first check if the user has not already been informed */
              if (!paginationInstructionFlag) {
                setSnackbarText(t('To load more items, swipe left or right'));
                setSnackbarVisible(true);
                setPaginationInstructionFlag(true);
              }
            }}
            renderItem={({ item }) => (
              <NotificationCard
                item={item}
                onReadButtonPress={notification => {
                  setReadNotification(notification);
                }}
                onViewButtonPress={notification => {
                  navigate('Notification', { notificationId: notification.id });
                }}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={loadNotifications}
              />
            }
          />
        </NotificationListContainer>
      )}
      {
        /* Using this render avoids possibly breaking other views */
        snackbarVisible && (
          <InfoSnackbar
            text={snackbarText}
            duration={1000}
            type={snackbarType}
            onCustomDismiss={() => setSnackbarVisible(false)}
          />
        )
      }
    </Container>
  );
};

export default Notifications;
