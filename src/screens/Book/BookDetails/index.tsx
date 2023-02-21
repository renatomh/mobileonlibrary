import React, { useCallback, useEffect } from 'react';

import { RefreshControl, Image, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { format } from 'date-fns';

/* Internationalization */
import t from '../../../i18n';

/* Components */
import InfoSnackbar from '../../../components/InfoSnackbar';

/* No Image Placeholder */
import NoImagePlaceholder from '../../../assets/no_image.png';

import { CoolGreenTheme as theme } from '../../../themes';
import {
  Container,
  PhotoContainer,
  AreaContainer,
  LoadingIcon,
  RowTitle,
  RowText,
} from './styles';

/* API hook */
import { useApiCrud, Response } from '../../../hooks/apiCrud';
/* App data context */
import { useAppData } from '../../../hooks/appData';

/* API communication */
import api from '../../../services/api';

const BookDetails: React.FC = () => {
  const { loading, setLoading } = useApiCrud();
  const {
    currentBook,
    setCurrentBook,
    snackbarText,
    snackbarType,
    snackbarVisible,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  } = useAppData();

  /* Function to load selected book */
  const loadBook = useCallback(async () => {
    if (currentBook.id) {
      const response: Response = await api.get(`/books/${currentBook.id}`);

      if (response.data.meta.success) {
        /* Setting the selected item */
        setCurrentBook(response.data.data);
      }
    }
  }, [currentBook.id, setCurrentBook]);

  /* Function to take a new photo for the item */
  const handleChangePhoto = useCallback(async () => {
    /* Defining the options for the photo to be taken */
    const options: CameraOptions = {
      mediaType: 'photo',
      /* Getting extra data from the image */
      includeExtra: true,
      /* Defining the picture quality */
      quality: 0.7,
    };

    /* Calling the function to use the device's camera */
    const result = await launchCamera(options);

    /* If the user has canceled, we just ignore */
    if (result.didCancel) return;

    /* Otherwise, we'll use the returned image */
    if (result.assets) {
      setLoading(true);

      /* Defining the data to be passed on the requisition */
      const data = new FormData();
      data.append('photo', {
        type: result.assets[0].type,
        name: `IMG_${format(new Date(), 'yyyyMMdd_HHmmss')}.jpg`,
        /* Defining new image path */
        uri: result.assets[0].uri,
      });

      /* Calling the API route to update item */
      await api
        .post(`/books/${currentBook.id}/photo`, data, {
          headers: {
            connection: 'keep-alive',
            'content-type': 'multipart/form-data',
          },
        })
        .then(response => {
          /* If there was en error */
          if (!response.data.meta.success) {
            /* We inform the user about the error */
            setSnackbarText(
              `${t('Error while uploading the file')}: ${
                response.data.meta.errors
              }`,
            );
            setSnackbarType('error');
            setSnackbarVisible(true);
            setLoading(false);
          }
          /* Otherwise, if response was successful */
          if (response.data.meta.success) {
            setLoading(false);
            /* Updating item data */
            loadBook();
          }
        })
        /* If there was another type of error */
        .catch(err => {
          /* We inform the user about the error */
          setSnackbarText(
            `${t('Error while uploading the file')}: ${JSON.stringify(err)}`,
          );
          setSnackbarType('error');
          setSnackbarVisible(true);
        });
    }
  }, [
    setLoading,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
    loadBook,
    currentBook.id,
  ]);

  useEffect(() => {
    /* Getting data related to the item */
    loadBook();
    /* ... */
    setSnackbarText('');
  }, [setSnackbarText, loadBook]);

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      {loading && (
        <LoadingIcon size="large" color={theme.colors.notification} />
      )}

      {/* Showing items if not loading */}
      {!loading && (
        <AreaContainer
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                loadBook();
              }}
            />
          }
        >
          <PhotoContainer>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{
                height: ((Dimensions.get('window').width - 32) * 3) / 5,
                width: Dimensions.get('window').width - 32,
              }}
              source={{
                uri:
                  /* If the item has a picture, we'll use it */
                  currentBook.photo_thumbnail_url ||
                  /* Otherwise, we'll use a default no image placeholder */
                  Image.resolveAssetSource(NoImagePlaceholder).uri,
              }}
            />
            <IconButton
              style={{
                position: 'absolute',
                right: -8,
                bottom: -32,
              }}
              icon="camera"
              color={theme.colors.onSurface}
              size={32}
              onPress={handleChangePhoto}
            />
          </PhotoContainer>
          <RowTitle>{t('Title')}</RowTitle>
          <RowText>{currentBook.title}</RowText>
          <RowTitle>{t('Author')}</RowTitle>
          <RowText>{currentBook.author}</RowText>
          <RowTitle>{t('Description')}</RowTitle>
          <RowText>
            {currentBook.description ? currentBook.description : '-'}
          </RowText>
        </AreaContainer>
      )}
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

export default BookDetails;
