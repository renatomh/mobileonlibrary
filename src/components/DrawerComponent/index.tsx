import React, { useMemo } from 'react';
import { View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Avatar, Drawer, Badge } from 'react-native-paper';

import {
  Container,
  DrawerContent,
  UserInfoSection,
  DrawerTitle,
  DrawerCaption,
  DrawerParagraph,
  Row,
  Section,
  BottomDrawerSection,
} from './styles';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';
import { useAuth } from '../../hooks/auth';

const DrawerComponent: React.FC<DrawerContentComponentProps> = (
  props: DrawerContentComponentProps,
) => {
  const { user, signOut } = useAuth();

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
    <Container>
      <DrawerContentScrollView {...props}>
        <DrawerContent>
          <UserInfoSection>
            <View
              style={{ flexDirection: 'row', marginTop: 15 }}
              onTouchEnd={() => {
                const { navigation } = props;
                navigation.navigate('Profile');
              }}
            >
              {UserAvatar}
              <View
                style={{ flex: 1, marginLeft: 15, flexDirection: 'column' }}
              >
                <DrawerTitle numberOfLines={1}>{user.name}</DrawerTitle>
                <DrawerCaption numberOfLines={1}>{user.username}</DrawerCaption>
              </View>
            </View>
            <Row>
              <Section>
                <DrawerParagraph>3</DrawerParagraph>
                <DrawerCaption>{t('Active Loans')}</DrawerCaption>
              </Section>
              {/* <Section>
                <DrawerParagraph>14</DrawerParagraph>
                <DrawerCaption>{t('Finished Loans')}</DrawerCaption>
              </Section> */}
            </Row>
          </UserInfoSection>

          <Drawer.Section>
            <Drawer.Item
              icon="home"
              label={t('Home')}
              onPress={() => {
                const { navigation } = props;
                navigation.navigate('Home');
              }}
            />
            <Drawer.Item
              icon="bell"
              label={t('Notifications')}
              onPress={() => {
                const { navigation } = props;
                navigation.navigate('Notifications');
              }}
              right={() =>
                user.unread_notifications_count > 0 && (
                  <Badge size={24}>{user.unread_notifications_count}</Badge>
                )
              }
            />
            {/* We check if the action/screen is allowed for the user */}
            {(user.role?.mobile_actions?.includes('*') ||
              user.role?.mobile_actions?.includes('Books')) && (
              <Drawer.Item
                icon="book"
                label={t('Books')}
                onPress={() => {
                  const { navigation } = props;
                  navigation.navigate('Books');
                }}
              />
            )}
          </Drawer.Section>
        </DrawerContent>
      </DrawerContentScrollView>

      <BottomDrawerSection>
        <Drawer.Item
          icon="logout"
          label={t('Sign Out')}
          onPress={() => {
            signOut();
          }}
        />
      </BottomDrawerSection>
    </Container>
  );
};

export default DrawerComponent;
