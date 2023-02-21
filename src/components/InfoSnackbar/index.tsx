import React, { useMemo } from 'react';

import { Snackbar } from 'react-native-paper';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';

/* Props interface */
interface Props {
  text: string;
  type: 'info' | 'success' | 'error';
  duration: number;
  onCustomDismiss: () => void;
}

const InfoSnackbar: React.FC<Props> = (props: Props) => {
  const { text, type, duration, onCustomDismiss } = props;

  /* Defining the Snackbar background color */
  const backgroundColor = useMemo(() => {
    if (type === 'info') return theme.colors.notificationBackdrop;
    if (type === 'success') return theme.colors.success;
    if (type === 'error') return theme.colors.error;
    return theme.colors.surface;
  }, [type]);

  return (
    <Snackbar
      visible
      style={{ backgroundColor }}
      theme={{
        colors: {
          accent: theme.colors.onSurface,
          surface: theme.colors.text,
        },
      }}
      onDismiss={() => onCustomDismiss()}
      duration={duration}
      action={{
        label: t('Ok'),
        onPress: () => onCustomDismiss(),
      }}
    >
      {text}
    </Snackbar>
  );
};

export default InfoSnackbar;
