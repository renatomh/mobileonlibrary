import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Container, DisplayText } from './styles';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';

const EmptyList: React.FC = () => {
  return (
    <Container>
      <Icon
        name="visibility-off"
        color={theme.colors.text}
        size={48}
        style={{ margin: 24 }}
      />
      <DisplayText>{t('No items to be displayed')}</DisplayText>
    </Container>
  );
};

export default EmptyList;
