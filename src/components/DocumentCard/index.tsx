import React, { useMemo } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, Linking } from 'react-native';
import { format } from 'date-fns';
import { partial } from 'filesize';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';
import {
  CardContainer,
  ImageArea,
  ThumbnailContainer,
  MainArea,
  IconsArea,
  RowContainer,
  RowsText,
} from './styles';

/* Interfaces */
import { DocumentModel as Item } from '../../models/document/document_model';

/* Props interface */
interface Props {
  item: Item;
  onDetailsViewPress: (documentModel: Item) => void;
}

const DocumentCard: React.FC<Props> = (props: Props) => {
  const { item, onDetailsViewPress } = props;

  /* Getting the function to auto format filesizes */
  const filesize = partial({ base: 2, standard: 'jedec' });

  /* Defining the image to be displayed for the document */
  const ImageItem = useMemo(() => {
    /* Checking which type of component must be rendered */
    /* If the document has a thumbnail, we'll use it */
    if (item.document?.file_thumbnail_url)
      return (
        <Image
          source={{ uri: item.document.file_thumbnail_url }}
          style={{ height: 82, width: 82, borderRadius: 4 }}
        />
      );
    /* Otherwise, we'll use the default icon */
    return (
      <ThumbnailContainer>
        <Icon
          name="file-document-outline"
          size={48}
          color={theme.colors.notificationBackdrop}
        />
      </ThumbnailContainer>
    );
  }, [item]);

  return (
    <CardContainer>
      <ImageArea
        onPress={() => {
          /* If the item document can be accessed */
          if (item.document) {
            try {
              /* 'AndroidManifest.xml' must be udpated when targeting Android 11 (SDK 30) */
              Linking.canOpenURL(item.document.file_url).then(supported => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                /* @ts-ignore: Unreachable code error */
                if (supported) Linking.openURL(item.document.file_url);
              });
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            }
          }
        }}
      >
        {ImageItem}
      </ImageArea>
      <MainArea>
        <RowsText numberOfLines={2}>{item.document?.description}</RowsText>
        <RowsText numberOfLines={1}>{item.document?.file_name}</RowsText>
        <RowContainer>
          <RowsText numberOfLines={1}>
            {item.document?.file_content_type}
          </RowsText>
          <RowsText numberOfLines={1}>
            {filesize(
              item.document ? parseInt(item.document.file_size, 10) : 0,
            )}
          </RowsText>
        </RowContainer>
        <RowsText numberOfLines={1}>
          {t('Uploaded by')}: {item.document?.user?.name || '-'}
        </RowsText>
        <RowsText numberOfLines={1}>
          {item.created_at
            ? format(
                new Date(
                  `${item.created_at.slice(0, 22)}:${item.created_at.slice(
                    22,
                  )}`,
                ),
                'dd/MM/yyyy HH:mm:ss',
              )
            : '-'}
        </RowsText>
      </MainArea>
      <IconsArea>
        <Icon
          name="information-outline"
          color={theme.colors.onSurface}
          size={24}
          onPress={() => {
            onDetailsViewPress(item);
          }}
        />
      </IconsArea>
    </CardContainer>
  );
};

export default DocumentCard;
