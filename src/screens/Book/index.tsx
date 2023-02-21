import React, { useEffect, useCallback } from 'react';

import { View } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
/* eslint-disable-next-line */
import { useNavigation } from '@react-navigation/core';
import IconButton from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';
import { Container } from './styles';

/* App data context */
import { useAppData } from '../../hooks/appData';

/* API communication */
import api from '../../services/api';

/* Tabs components */
import AssetDetails from './BookDetails';
import AssetDocument from './BookDocument';

/* Route params interface */
interface RouteParams {
  bookId: number;
}

const Book: React.FC = () => {
  const {
    currentBook,
    setCurrentBook,
    setOpenFiltersModal,
    setOpenSortingModal,
  } = useAppData();

  const { setOptions } = useNavigation();
  const route = useRoute();
  const { bookId } = route.params as RouteParams;

  /* Bottom navigation states */
  const [index, setIndex] = React.useState(0);
  const assetRoutes = [
    {
      key: 'details',
      title: t('Details'),
      icon: 'information-outline',
      badge: false,
    },
    { key: 'reviews', title: t('Reviews'), icon: 'star', badge: false },
    {
      key: 'documents',
      title: t('Documents'),
      icon: 'folder',
      badge: false,
    },
  ];
  const renderScene = BottomNavigation.SceneMap({
    details: AssetDetails,
    reviews: () => <Text>Reviews</Text>,
    documents: AssetDocument,
  });

  /* Function to load selected book */
  const loadBook = useCallback(async () => {
    const response: any = await api.get(`/books/${bookId}`);

    if (response.data.meta.success) {
      /* If no item was found, we navigate to the books screen */
      if (
        response.data.data === undefined ||
        response.data.data === null ||
        response.data.data.length === 0
      ) {
        // navigate('Books');
        console.log('No item found');
      }
      /* Setting the selected book */
      setCurrentBook(response.data.data);
    }
  }, [bookId, setCurrentBook]);

  useEffect(() => {
    /* Getting data related to the item */
    loadBook();
  }, [loadBook]);

  useEffect(() => {
    /* Updatng the main tab name */
    if (currentBook)
      setOptions({
        title: currentBook.title,
        headerRight: () =>
          /* For the service orders tab, we'll provide the sorting/filtering options */
          index === 1 ? (
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                style={{ marginRight: 12 }}
                color="white"
                name="sort-by-alpha"
                size={24}
                /* Here we will open a modal to select the sorting atribute to the service orders query */
                onPress={() => setOpenSortingModal(true)}
              />
              <IconButton
                style={{ marginRight: 12 }}
                color="white"
                name="filter-list"
                size={24}
                /* Here we will open a modal to apply filters to the service orders query */
                onPress={() => setOpenFiltersModal(true)}
              />
            </View>
          ) : null,
      });
  }, [
    setOptions,
    currentBook,
    setOpenFiltersModal,
    setOpenSortingModal,
    index,
  ]);

  useEffect(() => {
    setIndex(0);
  }, [currentBook, setIndex]);

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      <BottomNavigation
        navigationState={{ index, routes: assetRoutes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        activeColor={theme.colors.onSurface}
        inactiveColor={theme.colors.primary}
        barStyle={{ backgroundColor: theme.colors.accent }}
        labeled={false}
      />
    </Container>
  );
};

export default Book;
