import React from 'react';

import { format } from 'date-fns';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';
import {
  CardContainer,
  CardRow,
  CardTitle,
  CardText,
  CardViewButton,
} from './styles';

/* Interfaces */
import { Notification as Item } from '../../models/notification/notification';

/* Props interface */
interface Props {
  item: Item;
  onReadButtonPress: (notification: Item) => void;
  onViewButtonPress: (notification: Item) => void;
}

const NotificationCard: React.FC<Props> = (props: Props) => {
  const { item, onReadButtonPress, onViewButtonPress } = props;

  return (
    <CardContainer>
      <CardRow>
        <CardTitle
          numberOfLines={1}
          style={{ fontWeight: item.is_read === 0 ? 'bold' : 'normal' }}
        >
          {item.title}
        </CardTitle>
        <CardViewButton
          icon={item.is_read === 0 ? 'bell-ring' : 'bell-outline'}
          size={24}
          color={
            item.is_read === 0
              ? theme.colors.notification
              : theme.colors.onSurface
          }
          onPress={() => onReadButtonPress(item)}
        />
      </CardRow>
      <CardRow>
        <CardText numberOfLines={2} style={{ minHeight: 20 }}>
          {item.description}
        </CardText>
      </CardRow>
      <CardRow>
        <CardText numberOfLines={1}>
          {t('Delivered at')}
          {': '}
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
        </CardText>
        <CardViewButton
          icon="open-in-new"
          size={24}
          color={theme.colors.onSurface}
          onPress={() => onViewButtonPress(item)}
        />
      </CardRow>
    </CardContainer>
  );
};

export default NotificationCard;
