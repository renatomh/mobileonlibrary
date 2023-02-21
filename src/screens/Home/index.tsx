import React, { useMemo, useState } from 'react';
/* eslint-disable-next-line */
import { useFocusEffect } from '@react-navigation/core';

import { ScrollView, RefreshControl } from 'react-native';
import { Avatar } from 'react-native-paper';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';

import {
  HeaderContainer,
  HeaderTitleContainer,
  HeaderTitleText,
  HeaderContentText,
} from './styles';

import { useAuth } from '../../hooks/auth';

const Home: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  /* User's avatar */
  const UserAvatar = useMemo(() => {
    /* Checking which type of avatar must be rendered */
    /* If the user has a profile picture, we'll use it */
    if (user.avatar_thumbnail_url !== null) {
      return (
        <Avatar.Image size={50} source={{ uri: user.avatar_thumbnail_url }} />
      );
    }
    /* Otherwise, we'll use the employee's name initials */
    let nameInit = '-';
    const sepName = user.name.trim().split(/\s+/);
    /* If the user has a last name as well */
    if (sepName.length > 1)
      nameInit = `${sepName[0][0]}${sepName[sepName.length - 1][0]}`;
    /* Otherwise, we'll use only the first name initial */ else
      nameInit = `${sepName[0][0]}`;
    return (
      <Avatar.Text
        size={50}
        label={nameInit}
        color={theme.colors.onSurface}
        style={{ backgroundColor: theme.colors.accent }}
      />
    );
  }, [user.name, user.avatar_thumbnail_url]);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => {
            console.log('Loading');
          }}
        />
      }
    >
      <HeaderContainer>
        <HeaderTitleContainer>
          <HeaderTitleText numberOfLines={1}>{`${t('Hello')}, ${
            user.name
          }!`}</HeaderTitleText>
          {UserAvatar}
        </HeaderTitleContainer>
        <HeaderContentText>
          {t("Here's your last loan review")}
        </HeaderContentText>
      </HeaderContainer>
    </ScrollView>
  );
};

export default Home;
