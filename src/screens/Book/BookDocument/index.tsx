import React, { useCallback, useEffect, useState } from 'react';

import { FlatList, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Portal, Dialog, Button, FAB, TextInput } from 'react-native-paper';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { pickSingle } from 'react-native-document-picker';
import { format } from 'date-fns';
import { partial } from 'filesize';

/* Internationalization */
import t from '../../../i18n';

import { CoolGreenTheme as theme } from '../../../themes';
import {
  Container,
  LoadingIcon,
  TabTitle,
  ItemDocumentListContainer,
  DialogText,
} from './styles';

/* API hook */
import { useApiCrud } from '../../../hooks/apiCrud';
/* App data context */
import { useAppData } from '../../../hooks/appData';

/* API communication */
import api from '../../../services/api';

/* Interfaces */
import { DocumentModel as Item } from '../../../models/document/document_model';

/* Components */
import DocumentCard from '../../../components/DocumentCard';
import EmptyList from '../../../components/EmptyList';
import InfoSnackbar from '../../../components/InfoSnackbar';

/* Selected file interface */
interface SelectedFile {
  name: string;
  uri: string;
  fileSize: number;
  type: string;
}

const BookDocument: React.FC = () => {
  const { loading, setLoading, loadCrudData } = useApiCrud();
  const {
    currentBook,
    snackbarText,
    setSnackbarText,
    snackbarType,
    setSnackbarType,
    snackbarVisible,
    setSnackbarVisible,
  } = useAppData();

  /* Getting the function to auto format filesizes */
  const filesize = partial({ base: 2, standard: 'jedec' });

  /* Document states */
  const [bookDocuments, setBookDocuments] = useState<Item[]>([] as Item[]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Item | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  /* Upload document states */
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentObservations, setDocumentObservations] = useState('');
  const [openFABGroup, setOpenFABGroup] = useState(false);

  /* API pagination states */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [itemsCount, setItemsCount] = useState(0);

  /* State to detect left and right swipes movements */
  const [touchX, setTouchX] = useState(0);

  /* Function to take a picture to be uploaded */
  const handleSelectPhoto = useCallback(async () => {
    /* Defining the options for the photo to be taken */
    const options: CameraOptions = {
      mediaType: 'photo',
      /* Getting extra data from the image */
      includeExtra: true,
      /* Defining the picture quality */
      quality: 0.7,
      /* if we need to save the file locally (for example, during offline use) */
      // saveToPhotos: true,
    };

    /* Calling the function to use the device's camera */
    const result = await launchCamera(options);

    /* If the user has canceled, we just ignore */
    if (result.didCancel) return;

    /* Otherwise, we'll use the returned image */
    if (
      result.assets &&
      result.assets[0].uri &&
      result.assets[0].fileSize &&
      result.assets[0].type
    ) {
      /* Getting file URI */
      const { uri } = result.assets[0];
      /* Defining data to the file */
      const fileData: SelectedFile = {
        name: `IMG_${format(new Date(), 'YMMdd_HHmmss')}.jpg`,
        uri,
        fileSize: result.assets[0].fileSize,
        type: result.assets[0].type,
      };
      setSelectedFile(fileData);
      setDocumentDescription('');
      setDocumentObservations('');
      setOpenUploadModal(true);
    }
  }, []);

  /* Function to record a video to be uploaded */
  const handleSelectVideo = useCallback(async () => {
    /* Defining the options for the photo to be taken */
    const options: CameraOptions = {
      mediaType: 'video',
      /* Defining the vido duration limit */
      durationLimit: 30,
      /* Defining the video quality */
      videoQuality: 'low',
      /* Getting extra data from the file */
      includeExtra: true,
      /* if we need to save the file locally (for example, during offline use) */
      // saveToPhotos: true,
    };

    /* Calling the function to use the device's camera */
    const result = await launchCamera(options);

    /* If the user has canceled, we just ignore */
    if (result.didCancel) return;

    /* Otherwise, we'll use the returned image */
    if (
      result.assets &&
      result.assets[0].uri &&
      result.assets[0].fileSize &&
      result.assets[0].type
    ) {
      /* Getting file URI */
      const { uri } = result.assets[0];
      /* Defining data to the file */
      const fileData: SelectedFile = {
        name: `VID_${format(new Date(), 'YMMdd_HHmmss')}.mp4`,
        uri,
        fileSize: result.assets[0].fileSize,
        type: result.assets[0].type,
      };
      setSelectedFile(fileData);
      setDocumentDescription('');
      setDocumentObservations('');
      setOpenUploadModal(true);
    }
  }, []);

  /* Function to select a file to be uploaded */
  const handleSelectFile = useCallback(async () => {
    try {
      /* Calling the function to use the device's storage */
      const result = await pickSingle({
        /* Defining the options for the file to be selected */
        type: '*/*',
        allowMultiSelection: false,
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      /* Otherwise, we'll use the returned file */
      if (result) {
        /* Defining data to the file */
        const fileData: SelectedFile = {
          name: result.name,
          uri: result.fileCopyUri || result.uri,
          fileSize: result.size || 0,
          type: result.type || '',
        };
        setSelectedFile(fileData);
        setDocumentDescription('');
        setDocumentObservations('');
        setOpenUploadModal(true);
      }
    } catch (e) {
      /* If the user has canceled or an error occurs, we just ignore */
      // console.log(e);
    }
  }, []);

  /* Function to load item's documents */
  const loadBookDocuments = useCallback(async (): Promise<void> => {
    const response: any = await loadCrudData({
      route: `/books/${currentBook.id}/documents`,
      page,
      limit,
    });

    if (response.meta.success) {
      /* Getting data returned from API */
      const { data } = response;
      /* Setting the items */
      setBookDocuments(data);
      /* And the items count */
      setItemsCount(response.meta.count);
    }
  }, [currentBook.id, loadCrudData, page, limit]);

  /* Function to upload a document to an asset */
  const handleUploadDocument = useCallback(async () => {
    setLoading(true);

    /* Defining the data to be passed on the requisition */
    const data = new FormData();
    data.append('file', {
      type: selectedFile?.type,
      name: selectedFile?.name,
      uri: selectedFile?.uri,
    });
    data.append('description', documentDescription);
    data.append('observations', documentObservations);

    /* Calling the API route to upload file */
    await api
      .post(`/books/${currentBook.id}/documents`, data, {
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
        }
        /* Otherwise, if response was successful */
        if (response.data.meta.success) {
          /* Updating the items list */
          loadBookDocuments();
        }
      })
      /** If there was another type of error */
      .catch(err => {
        /* We inform the user about the error */
        setSnackbarText(
          `${t('Error while uploading the file')}: ${JSON.stringify(err)}`,
        );
        setSnackbarType('error');
        setSnackbarVisible(true);
      });
    setLoading(false);
  }, [
    setLoading,
    loadBookDocuments,
    currentBook.id,
    selectedFile?.name,
    selectedFile?.type,
    selectedFile?.uri,
    documentDescription,
    documentObservations,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  ]);

  /* When a new asset is selected */
  useEffect(() => {
    /* Setting first page for API query */
    setPage(1);
    /* Setting API query limit */
    setLimit(15);
  }, [currentBook]);

  /* When the screen is loaded */
  useEffect(() => {
    /* Getting data related to the asset */
    loadBookDocuments();
  }, [loadBookDocuments]);

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      <Portal>
        <Dialog
          visible={openDetailsModal}
          onDismiss={() => {
            setOpenDetailsModal(false);
          }}
          dismissable={false}
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
          }}
        >
          <Dialog.Title>{t('Document')}</Dialog.Title>
          <Dialog.ScrollArea
            /* This is required, otherwise the list view could break the dialog view */
            style={{ maxHeight: Dimensions.get('window').height / 2 }}
          >
            <ScrollView>
              <DialogText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {t('Description')}
              </DialogText>
              <DialogText>{selectedDocument?.document?.description}</DialogText>
              <DialogText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {t('Observations')}
              </DialogText>
              <DialogText>
                {selectedDocument?.document?.observations || '-'}
              </DialogText>
              <DialogText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {t('File')}
              </DialogText>
              <DialogText>
                {selectedDocument?.document?.file_name} (
                {selectedDocument
                  ? filesize(
                      selectedDocument.document
                        ? parseInt(selectedDocument.document.file_size, 10)
                        : 0,
                    )
                  : '-'}
                )
              </DialogText>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setOpenDetailsModal(false);
              }}
              color={theme.colors.onSurface}
            >
              {t('Ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={openUploadModal}
          dismissable={false}
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
          }}
        >
          <Dialog.Title>{t('Upload New File')}</Dialog.Title>
          <Dialog.ScrollArea
            /* This is required, otherwise the scroll view could break the dialog view */
            style={{ maxHeight: Dimensions.get('window').height / 2 }}
          >
            <ScrollView>
              <DialogText>
                {t('File')}: {selectedFile?.name} (
                {filesize(selectedFile?.fileSize || 0)})
              </DialogText>
              <DialogText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {t('Description')}
              </DialogText>
              <TextInput
                mode="outlined"
                keyboardType="default"
                placeholder={t('Document description')}
                value={documentDescription}
                maxLength={256}
                autoCorrect={false}
                onChangeText={text => setDocumentDescription(text)}
              />
              <DialogText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {t('Observations')}
              </DialogText>
              <TextInput
                mode="outlined"
                keyboardType="default"
                placeholder={t('Observations')}
                value={documentObservations}
                maxLength={512}
                autoCorrect={false}
                onChangeText={text => setDocumentObservations(text)}
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => setOpenUploadModal(false)}
              color={theme.colors.onSurface}
            >
              {t('Cancel')}
            </Button>
            <Button
              onPress={() => {
                handleUploadDocument();
                setOpenUploadModal(false);
              }}
              color={theme.colors.onSurface}
              /* We'll only allow user to upload, if a valid description was provided */
              disabled={documentDescription === ''}
            >
              {t('Upload')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <TabTitle>{t('Documents')}</TabTitle>

      {loading && (
        <LoadingIcon size="large" color={theme.colors.notification} />
      )}

      {/* Showing list items if not loading */}
      {!loading && (
        <ItemDocumentListContainer
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
            data={bookDocuments}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: Item) => item.id.toString()}
            ListEmptyComponent={EmptyList}
            // Required to avoid cropping last itme
            // Ref: https://stackoverflow.com/questions/46196242/react-native-flatlist-last-item-visibility-issue
            // In this case, we use 'margin-bottom' double of 'ItemContainer'
            contentContainerStyle={{ paddingBottom: 16 }}
            style={{ marginBottom: 4 }}
            renderItem={({ item }) => {
              return (
                <DocumentCard
                  item={item}
                  onDetailsViewPress={item => {
                    setSelectedDocument(item);
                    setOpenDetailsModal(true);
                  }}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={loadBookDocuments}
              />
            }
          />
        </ItemDocumentListContainer>
      )}
      <FAB
        icon="camera"
        animated
        small
        visible={!loading && openFABGroup}
        onPress={() => {
          handleSelectPhoto();
          setOpenFABGroup(false);
        }}
        color={theme.colors.onSurface}
        style={{
          backgroundColor: theme.colors.secondary,
          position: 'absolute',
          margin: 16,
          right: 8,
          bottom: 202,
        }}
      />
      <FAB
        icon="video"
        animated
        small
        visible={!loading && openFABGroup}
        onPress={() => {
          handleSelectVideo();
          setOpenFABGroup(false);
        }}
        color={theme.colors.onSurface}
        style={{
          backgroundColor: theme.colors.secondary,
          position: 'absolute',
          margin: 16,
          right: 8,
          bottom: 138,
        }}
      />
      <FAB
        icon="file"
        animated
        small
        visible={!loading && openFABGroup}
        onPress={() => {
          handleSelectFile();
          setOpenFABGroup(false);
        }}
        color={theme.colors.onSurface}
        style={{
          backgroundColor: theme.colors.secondary,
          position: 'absolute',
          margin: 16,
          right: 8,
          bottom: 76,
        }}
      />
      <FAB
        icon={openFABGroup ? 'close' : 'plus'}
        onPress={() => {
          if (openFABGroup) setOpenFABGroup(false);
          else setOpenFABGroup(true);
        }}
        color={theme.colors.onSurface}
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
      />
      {
        /* Using this render avoids possibly breaking other views */
        snackbarVisible && (
          <InfoSnackbar
            text={snackbarText}
            duration={3500}
            type={snackbarType}
            onCustomDismiss={() => setSnackbarVisible(false)}
          />
        )
      }
    </Container>
  );
};

export default BookDocument;
