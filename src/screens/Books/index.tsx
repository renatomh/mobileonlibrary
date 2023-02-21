import React, { useCallback, useEffect, useState } from 'react';

import {
  FlatList,
  RefreshControl,
  Dimensions,
  ScrollView,
  View,
} from 'react-native';
import { Portal, Dialog, Button, TextInput, Text } from 'react-native-paper';
import { format } from 'date-fns';
import { DatePickerModal } from 'react-native-paper-dates';
/* eslint-disable-next-line */
import { useNavigation } from '@react-navigation/core';
import IconButton from 'react-native-vector-icons/MaterialIcons';

/* Internationalization */
import t from '../../i18n';

/* Components */
import EmptyList from '../../components/EmptyList';
import InfoSnackbar from '../../components/InfoSnackbar';

import { CoolGreenTheme as theme } from '../../themes';

import {
  Container,
  LoadingIcon,
  ServiceOrderListContainer,
  DialogText,
  DialogSelectText,
  DialogItemsList,
  DialogItemsText,
  DialogRow,
} from './styles';

import { useAppData } from '../../hooks/appData';

/* API communication */
import { FilterData, useApiCrud } from '../../hooks/apiCrud';

/* Sorting options */
type SortingProperty = 'title' | 'id';
const sortingOptions = [
  { key: 'title', value: t('Title') },
  { key: 'id', value: t('Book Number') },
] as { key: SortingProperty; value: string }[];

const Books: React.FC = () => {
  const { loading, loadCrudData } = useApiCrud();
  const { setOptions } = useNavigation();
  const {
    snackbarText,
    snackbarType,
    snackbarVisible,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  } = useAppData();

  const [books, setBooks] = useState<any[]>([] as any[]);

  /* API pagination states */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [itemsCount, setItemsCount] = useState(0);

  /* State to detect left and right swipes movements */
  const [touchX, setTouchX] = useState(0);
  const [paginationInstructionFlag, setPaginationInstructionFlag] =
    useState(false);

  /* Sorting states */
  const [sortingProperty, setSortingProperty] =
    useState<SortingProperty>('title');
  const [sortingDirection, setSortingDirection] = useState<'asc' | 'desc'>(
    'desc',
  );
  const [openSortingModal, setOpenSortingModal] = useState(false);
  const [openSelectSortingModal, setOpenSelectSortingModal] = useState(false);

  /* Filtering states */
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  /* TItle/author */
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  /* Availability date */
  const [availableFromDate, setAvailableFromDate] = useState<
    Date | undefined
  >();
  const [availableToDate, setAvailableToDate] = useState<Date | undefined>();
  const [
    openFromAvailableDatePickerModal,
    setOpenFromAvailableDatePickerModal,
  ] = useState(false);
  const [openToAvailableDatePickerModal, setOpenToAvailableDatePickerModal] =
    useState(false);

  /* Function to load books data */
  const loadBooks = useCallback(async (): Promise<void> => {
    /* Defining filters for the query */
    const filter = [] as FilterData[];
    /* If other filters were provided */
    if (availableFromDate !== undefined)
      filter.push({
        property: 'available_at',
        value: format(availableFromDate, 'yyyy-MM-dd'),
        anyMatch: true,
        joinOn: 'and',
        operator: '>=',
      });
    if (availableToDate !== undefined)
      filter.push({
        property: 'available_at',
        value: format(availableToDate, 'yyyy-MM-dd'),
        anyMatch: true,
        joinOn: 'and',
        operator: '<=',
      });
    if (title !== '')
      filter.push({
        property: 'title',
        value: title,
        anyMatch: true,
        joinOn: 'and',
        operator: 'like',
      });
    if (author !== '')
      filter.push({
        property: 'author',
        value: title,
        anyMatch: true,
        joinOn: 'and',
        operator: 'like',
      });
    /* Making the API call */
    const response: any = await loadCrudData({
      route: `/books`,
      page,
      limit,
      sort: [{ property: sortingProperty, direction: sortingDirection }],
      filter,
    });

    if (response.meta.success) {
      /* Getting data returned from API */
      const books = response.data;
      /* Setting the items */
      setBooks(books);
      /* And the items count */
      setItemsCount(response.meta.count);
    }
  }, [
    loadCrudData,
    page,
    limit,
    sortingProperty,
    sortingDirection,
    title,
    author,
    availableFromDate,
    availableToDate,
  ]);

  useEffect(
    () => {
      /* Loading the items */
      loadBooks();

      /* Updatng the main tab name */
      setOptions({
        title: t('Books'),
        headerRight: () => (
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
        ),
      });
      /* Initializing the 'limit', to avoid eslint errors */
      setLimit(10);
    },
    /* For now, we don't want to update every time the user types */
    [loadBooks, setOptions],
  );

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      <Portal>
        <Dialog
          visible={openFiltersModal}
          onDismiss={() => setOpenFiltersModal(false)}
          dismissable={false}
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
          }}
        >
          <Dialog.Title>{t('Filters')}</Dialog.Title>
          <Dialog.ScrollArea
            /* This is required, otherwise the list view could break the dialog view */
            style={{ maxHeight: Dimensions.get('window').height / 2 }}
          >
            <ScrollView>
              <TextInput
                mode="outlined"
                keyboardType="default"
                placeholder={t('Title')}
                label={t('Title')}
                value={title}
                maxLength={50}
                onChangeText={setTitle}
              />
              <TextInput
                mode="outlined"
                keyboardType="default"
                placeholder={t('Author')}
                label={t('Author')}
                value={author}
                maxLength={50}
                onChangeText={setAuthor}
              />
              <DialogText>{t('Available At')}</DialogText>
              <DialogRow>
                <DialogSelectText
                  style={{
                    textAlignVertical: 'center',
                    flex: 1,
                    marginRight: 4,
                  }}
                  onPress={() => setOpenFromAvailableDatePickerModal(true)}
                >
                  {availableFromDate
                    ? format(availableFromDate, 'dd/MM/yyyy')
                    : t('From')}
                </DialogSelectText>
                <DialogSelectText
                  style={{
                    textAlignVertical: 'center',
                    flex: 1,
                    marginLeft: 4,
                  }}
                  onPress={() => setOpenToAvailableDatePickerModal(true)}
                >
                  {availableToDate
                    ? format(availableToDate, 'dd/MM/yyyy')
                    : t('To')}
                </DialogSelectText>
              </DialogRow>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => setOpenFiltersModal(false)}
              color={theme.colors.onSurface}
            >
              {t('Cancel')}
            </Button>
            <Button
              onPress={() => {
                setOpenFiltersModal(false);
              }}
              color={theme.colors.onSurface}
            >
              {t('Ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={openSortingModal}
          onDismiss={() => setOpenSortingModal(false)}
          dismissable={false}
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
          }}
        >
          <Dialog.Title>{t('Sort By')}</Dialog.Title>
          <Dialog.ScrollArea
            /* This is required, otherwise the list view could break the dialog view */
            style={{ maxHeight: Dimensions.get('window').height / 2 }}
          >
            <ScrollView>
              <DialogText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {t('Property')}
              </DialogText>
              <DialogRow style={{ alignItems: 'center' }}>
                <DialogSelectText
                  style={{
                    textAlignVertical: 'center',
                    flex: 1,
                    marginRight: 8,
                  }}
                  onPress={() => setOpenSelectSortingModal(true)}
                >
                  {
                    sortingOptions.filter(option => {
                      return option.key === sortingProperty;
                    })[0].value
                  }
                </DialogSelectText>
                <IconButton
                  style={{ margin: 2 }}
                  color={sortingDirection === 'asc' ? 'red' : 'green'}
                  name={
                    sortingDirection === 'asc'
                      ? 'arrow-circle-down'
                      : 'arrow-circle-up'
                  }
                  size={42}
                  /* Here we will open a modal to select the sorting atribute to the service orders query */
                  onPress={() =>
                    setSortingDirection(
                      sortingDirection === 'asc' ? 'desc' : 'asc',
                    )
                  }
                />
              </DialogRow>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => setOpenSortingModal(false)}
              color={theme.colors.onSurface}
            >
              {t('Cancel')}
            </Button>
            <Button
              onPress={() => {
                setOpenSortingModal(false);
              }}
              color={theme.colors.onSurface}
            >
              {t('Ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={openSelectSortingModal}
          dismissable={false}
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
          }}
        >
          <Dialog.Title>{t('Select Property')}</Dialog.Title>
          <Dialog.ScrollArea
            /* This is required, otherwise the list view could break the dialog view */
            style={{ maxHeight: Dimensions.get('window').height / 2 }}
          >
            <FlatList
              data={sortingOptions}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: { key: SortingProperty; value: string }) =>
                item.key
              }
              renderItem={({ item }) => {
                return (
                  <DialogItemsList
                    onPress={() => {
                      setSortingProperty(item.key);
                      setOpenSelectSortingModal(false);
                    }}
                    style={{
                      backgroundColor:
                        sortingProperty === item.key
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
                setOpenSelectSortingModal(false);
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
        <ServiceOrderListContainer
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
            data={[
              { id: 1, title: 'Lord of the Rings', author: 'J. R. R. Tolkien' },
            ]}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item.id.toString()}
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
                setSnackbarType('info');
                setSnackbarVisible(true);
                setPaginationInstructionFlag(true);
              }
            }}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadBooks} />
            }
          />
        </ServiceOrderListContainer>
      )}
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={
          openFromAvailableDatePickerModal || openToAvailableDatePickerModal
        }
        onDismiss={() => {
          setOpenFromAvailableDatePickerModal(false);
          setOpenToAvailableDatePickerModal(false);
          /* On dismiss we'll clear the dates */
          if (openFromAvailableDatePickerModal) setAvailableFromDate(undefined);
          else if (openToAvailableDatePickerModal)
            setAvailableToDate(undefined);
        }}
        date={
          openFromAvailableDatePickerModal ? availableFromDate : availableToDate
        }
        onConfirm={(params: any) => {
          setOpenFromAvailableDatePickerModal(false);
          setOpenToAvailableDatePickerModal(false);
          if (openFromAvailableDatePickerModal)
            setAvailableFromDate(params.date);
          else if (openToAvailableDatePickerModal)
            setAvailableToDate(params.date);
        }}
        onChange={(params: any) => {
          if (openFromAvailableDatePickerModal)
            setAvailableFromDate(params.date);
          else if (openToAvailableDatePickerModal)
            setAvailableToDate(params.date);
        }}
        saveLabel={t('Save')}
        label={t('Select date')}
        emptyLabel={t('Any')}
        validRange={
          openToAvailableDatePickerModal
            ? { startDate: availableFromDate }
            : { endDate: availableToDate }
        }
        startYear={2000}
        endYear={2100}
      />
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

export default Books;
