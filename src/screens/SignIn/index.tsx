import React, { useState, useCallback, useEffect } from 'react';
import {
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
/* eslint-disable-next-line */
import { useNavigation } from '@react-navigation/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-community/async-storage';

import {
  HelperText,
  Text,
  TextInput,
  Button,
  Checkbox,
} from 'react-native-paper';

import { CoolGreenTheme as theme } from '../../themes';

/* Internationalization */
import t from '../../i18n';

/* Components */
import InfoSnackbar from '../../components/InfoSnackbar';

import { useAuth } from '../../hooks/auth';
import { useAppData } from '../../hooks/appData';

/* App logo is automatically loaded with ideal size (normal, @2x, @3x) */
import logoImg from '../../assets/logo.png';

import { Container, Banner, Title, CheckboxContainer } from './styles';

/* API communication */
import api from '../../services/api';

interface SignInFormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  /* Context methods */
  const { signIn } = useAuth();
  const {
    snackbarText,
    snackbarType,
    snackbarVisible,
    setSnackbarText,
    setSnackbarType,
    setSnackbarVisible,
  } = useAppData();

  /* CheckBox to remember user's username */
  const [toggleUsernameCheckBox, setToggleUsernameCheckBox] = useState(false);
  /* Password visibility */
  const [togglePassword, setTogglePassword] = useState(false);
  /* Other component states */
  const [loading, setLoading] = useState(false);
  const [storedUsername, setStoredUsername] = useState('');

  useEffect(() => {
    /* Checking if there's a saved email/username */
    async function loadUsername(): Promise<void> {
      const username = await AsyncStorage.getItem('@mobileonlibrary:username');
      if (username) {
        setToggleUsernameCheckBox(true);
        setStoredUsername(username);
      }
    }
    loadUsername();
  }, []);

  /* Handling form submit */
  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      if (toggleUsernameCheckBox)
        await AsyncStorage.setItem('@mobileonlibrary:username', data.username);
      else await AsyncStorage.multiRemove(['@mobileonlibrary:username']);

      /* First we check if the base URL for the API requests is set */
      if (api.defaults.baseURL === '') {
        setSnackbarText(
          t('No server domain set, please update it on the settings page'),
        );
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }

      setLoading(true);
      try {
        /* Calling the login function */
        const res = await signIn(data);
        /* Here we don't set 'loading' to false, since it'll be in other component and it would generate a warning */

        if (!res.meta.success) {
          setSnackbarText(
            `${t('Error on login')}: ${JSON.stringify(res.meta.errors)}`,
          );
          setSnackbarType('error');
          setSnackbarVisible(true);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        /* Otherwise, we inform the user via a toast message */
        setSnackbarText(t('Error on login, please verify'));
        setSnackbarType('error');
        setSnackbarVisible(true);
      }
    },
    [
      signIn,
      toggleUsernameCheckBox,
      setSnackbarText,
      setSnackbarType,
      setSnackbarVisible,
    ],
  );

  /* Yup Validation */
  const schema = Yup.object().shape({
    username: Yup.string().required(t('User required')),
    password: Yup.string().required(t('Password required')),
  });

  return (
    <>
      {/* Used for iOS */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        {/* Used when there's too many elements */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Container>
            <Banner>
              <Image source={logoImg} />
              <Title>{t('Login to your account')}</Title>
            </Banner>

            {/* Data form */}
            <Formik
              enableReinitialize /* Required to set username after loading from async storage */
              initialValues={{ username: storedUsername, password: '' }}
              onSubmit={values => handleSubmit(values)}
              validationSchema={schema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <TextInput
                    label={t('Username')}
                    mode="outlined"
                    style={{ margin: 4 }}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    error={!!errors.username && touched.username}
                    left={<TextInput.Icon name="account" />}
                  />
                  {errors.username && (
                    <HelperText type="error" visible={!!errors.username}>
                      {errors.username}
                    </HelperText>
                  )}
                  <TextInput
                    label={t('Password')}
                    mode="outlined"
                    secureTextEntry={!togglePassword}
                    style={{ margin: 4 }}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    error={!!errors.password && touched.password}
                    left={<TextInput.Icon name="lock" />}
                    right={
                      <TextInput.Icon
                        name={togglePassword ? 'eye-off' : 'eye'}
                        onPress={() => {
                          setTogglePassword(!togglePassword);
                        }}
                      />
                    }
                  />
                  {errors.password && (
                    <HelperText type="error" visible={!!errors.password}>
                      {errors.password}
                    </HelperText>
                  )}
                  <CheckboxContainer>
                    <Checkbox
                      status={toggleUsernameCheckBox ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setToggleUsernameCheckBox(!toggleUsernameCheckBox);
                      }}
                    />
                    <Text>{t('Remember user')}</Text>
                  </CheckboxContainer>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    style={{
                      marginTop: 8,
                      backgroundColor: theme.colors.accent,
                    }}
                  >
                    {t('Login')}
                  </Button>
                </>
              )}
            </Formik>
          </Container>
        </ScrollView>
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
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
