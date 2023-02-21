import React, { useCallback, useMemo, useState } from 'react';
/* eslint-disable-next-line */
import { useFocusEffect } from '@react-navigation/core';
import { format } from 'date-fns';

import { ScrollView, Dimensions } from 'react-native';
import {
  Portal,
  TextInput,
  IconButton,
  Button,
  Dialog,
  Avatar,
} from 'react-native-paper';
import { launchCamera, CameraOptions } from 'react-native-image-picker';

/* Internationalization */
import t from '../../i18n';

import { CoolGreenTheme as theme } from '../../themes';

import {
  Container,
  AvatarContainer,
  DataContainer,
  RowTitle,
  RowText,
} from './styles';

import { useAuth } from '../../hooks/auth';
import { useAppData } from '../../hooks/appData';

/* API communication */
import api from '../../services/api';

/* Components */
import InfoSnackbar from '../../components/InfoSnackbar';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const {
    snackbarText,
    setSnackbarText,
    snackbarType,
    setSnackbarType,
    snackbarVisible,
    setSnackbarVisible,
  } = useAppData();

  const [loading, setLoading] = useState(false);

  /* Profile data states */
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);

  /* Password change modal */
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [toggleCurrentPassword, setToggleCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [togglePasswordConfirmation, setTogglePasswordConfirmation] =
    useState(false);

  /* Function to update a user's profile data */
  const handleUpdateProfile = useCallback(async () => {
    setLoading(true);
    /* Defining the data to be passed on the requisition */
    const data = {
      name,
      username,
    };
    /* Calling the API route to update item */
    const response = await api.put(`/profile`, data);
    /* If there was en error */
    if (!response.data.meta.success) {
      /* We inform the user about the error */
      setSnackbarText(
        `${t('Error while updating profile')}: ${response.data.meta.errors}`,
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
      setLoading(false);
    }
    /* Otherwise, if response was successful */
    if (response.data.meta.success) {
      setLoading(false);
      /* Showing user info about success */
      setSnackbarText(t('Profile has been updated successfully!'));
      setSnackbarType('success');
      setSnackbarVisible(true);
      /* Updating user's data */
      updateUser({
        ...user,
        name: response.data.data.name,
        username: response.data.data.username,
      });
    }

    setLoading(false);
  }, [
    name,
    username,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
    user,
    updateUser,
  ]);

  /* Function to update a user's password */
  const handleChangePassword = useCallback(async () => {
    setLoading(true);
    /* Defining the data to be passed on the requisition */
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      password_confirmation: passwordConfirmation,
    };
    /* Calling the API route to update item */
    const response = await api.put(`/profile`, data);
    /* If there was en error */
    if (!response.data.meta.success) {
      /* We inform the user about the error */
      setSnackbarText(
        `${t('Error while changing password')}: ${response.data.meta.errors}`,
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
      setLoading(false);
    }
    /* Otherwise, if response was successful */
    if (response.data.meta.success) {
      setLoading(false);
      /* Showing user info about success */
      setSnackbarText(t('Password has been changed successfully!'));
      setSnackbarType('success');
      setSnackbarVisible(true);
      /* If everything is ok, we'll clear the passwords text states */
      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirmation('');
    }

    setLoading(false);
  }, [
    currentPassword,
    newPassword,
    passwordConfirmation,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  ]);

  /* Function to take a new profile picture */
  const handleChangeProfilePicture = useCallback(async () => {
    /* Defining the options for the photo to be taken */
    const options: CameraOptions = {
      mediaType: 'photo',
      /* Getting extra data from the image */
      includeExtra: true,
      /* Defining the picture quality */
      quality: 0.7,
      /* By default, we'll use the front camera */
      cameraType: 'front',
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
      data.append('avatar', {
        type: result.assets[0].type,
        name: `IMG_${format(new Date(), 'yyyyMMdd_HHmmss')}.jpg`,
        /* Defining new image path */
        uri: result.assets[0].uri,
      });

      /* Calling the API route to update item */
      await api
        .post(`/profile/avatar`, data, {
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
            /* Updating user's data */
            updateUser({
              ...user,
              avatar_url: response.data.data.avatar_url,
              avatar_thumbnail_url: response.data.data.avatar_thumbnail_url,
            });
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
    user,
    updateUser,
  ]);

  /* This is similar to a 'useEffect', but it loads whenever route is focused */
  useFocusEffect(
    useCallback(() => {
      /* Loading the user's data */
    }, []),
  );

  /* User's avatar */
  const UserAvatar = useMemo(() => {
    /* Checking which type of avatar must be rendered */
    /* If the user has a profile picture, we'll use it */
    if (user.avatar_thumbnail_url !== null) {
      return (
        <Avatar.Image size={172} source={{ uri: user.avatar_thumbnail_url }} />
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
        size={172}
        label={nameInit}
        color={theme.colors.onSurface}
        style={{ backgroundColor: theme.colors.accent }}
      />
    );
  }, [user.name, user.avatar_thumbnail_url]);

  return (
    <Container style={{ backgroundColor: theme.colors.background }}>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <Portal>
          <Dialog
            visible={openPasswordModal}
            dismissable={false}
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 12,
            }}
          >
            <Dialog.Title>{t('Change Password')}</Dialog.Title>
            <Dialog.ScrollArea
              /* This is required, otherwise the scroll view could break the dialog view */
              style={{ maxHeight: Dimensions.get('window').height / 2 }}
            >
              <ScrollView>
                <TextInput
                  mode="outlined"
                  keyboardType="default"
                  secureTextEntry={!toggleCurrentPassword}
                  style={{ marginVertical: 8 }}
                  placeholder={t('Current Password')}
                  value={currentPassword}
                  maxLength={256}
                  label={t('Current Password')}
                  left={<TextInput.Icon name="lock" />}
                  right={
                    <TextInput.Icon
                      name={toggleCurrentPassword ? 'eye-off' : 'eye'}
                      onPress={() => {
                        setToggleCurrentPassword(!toggleCurrentPassword);
                      }}
                    />
                  }
                  onChangeText={setCurrentPassword}
                />
                <TextInput
                  mode="outlined"
                  keyboardType="default"
                  secureTextEntry={!toggleNewPassword}
                  style={{ marginVertical: 8 }}
                  placeholder={t('New Password')}
                  value={newPassword}
                  maxLength={256}
                  label={t('New Password')}
                  left={<TextInput.Icon name="lock" />}
                  right={
                    <TextInput.Icon
                      name={toggleNewPassword ? 'eye-off' : 'eye'}
                      onPress={() => {
                        setToggleNewPassword(!toggleNewPassword);
                      }}
                    />
                  }
                  onChangeText={setNewPassword}
                />
                <TextInput
                  mode="outlined"
                  keyboardType="default"
                  secureTextEntry={!togglePasswordConfirmation}
                  style={{ marginVertical: 8 }}
                  placeholder={t('Password Confirmation')}
                  value={passwordConfirmation}
                  maxLength={256}
                  label={t('Password Confirmation')}
                  left={<TextInput.Icon name="lock" />}
                  right={
                    <TextInput.Icon
                      name={togglePasswordConfirmation ? 'eye-off' : 'eye'}
                      onPress={() => {
                        setTogglePasswordConfirmation(
                          !togglePasswordConfirmation,
                        );
                      }}
                    />
                  }
                  onChangeText={setPasswordConfirmation}
                />
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button
                onPress={() => setOpenPasswordModal(false)}
                color={theme.colors.onSurface}
              >
                {t('Cancel')}
              </Button>
              <Button
                onPress={() => {
                  handleChangePassword();
                  setOpenPasswordModal(false);
                }}
                color={theme.colors.onSurface}
                /* We'll only allow user to change password, if valid data was provided */
                /* All fields must be filled and password confirmation must match new password */
                disabled={
                  currentPassword === '' ||
                  newPassword === '' ||
                  passwordConfirmation === '' ||
                  newPassword !== passwordConfirmation
                }
              >
                {t('Confirm')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <AvatarContainer>
          {UserAvatar}
          <IconButton
            style={{
              position: 'absolute',
              right: -8,
              bottom: -8,
            }}
            icon="camera"
            color={theme.colors.onSurface}
            size={32}
            onPress={handleChangeProfilePicture}
          />
        </AvatarContainer>
        <DataContainer>
          <TextInput
            mode="outlined"
            keyboardType="default"
            placeholder={t('Name')}
            value={name}
            label={t('Name')}
            maxLength={128}
            onChangeText={setName}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            mode="outlined"
            keyboardType="default"
            placeholder={t('Username')}
            value={username}
            label={t('Username')}
            maxLength={128}
            onChangeText={setUsername}
            style={{ marginBottom: 12 }}
          />
          <RowTitle>{t('Email')}</RowTitle>
          <RowText>{user.email !== null ? user.email : '-'}</RowText>
          <RowTitle>{t('Role')}</RowTitle>
          <RowText>{user.role !== undefined ? user.role.name : '-'}</RowText>
          <RowTitle>{t('Last Login At')}</RowTitle>
          <RowText>
            {user.last_login_at !== null
              ? format(
                  new Date(
                    `${user.last_login_at.slice(
                      0,
                      22,
                    )}:${user.last_login_at.slice(22)}`,
                  ),
                  'dd/MM/yyyy HH:mm:ss',
                )
              : '-'}
          </RowText>
        </DataContainer>
        <Button
          mode="contained"
          onPress={() => {
            setOpenPasswordModal(true);
          }}
          loading={loading}
          style={{
            margin: 8,
            padding: 2,
            backgroundColor: theme.colors.secondary,
          }}
        >
          {t('Change Password')}
        </Button>
        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          loading={loading}
          style={{
            margin: 8,
            padding: 2,
            backgroundColor: theme.colors.accent,
          }}
        >
          {t('Update Profile')}
        </Button>
      </ScrollView>
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

export default Profile;
