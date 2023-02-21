<h1 align="center"><img alt="OnLibrary Mobile" title="OnLibrary Mobile" src=".github/logo.png" width="250" /></h1>

# OnLibrary Mobile

## 💡 Project's Idea

This project was developed to create a mobile application for the online library platform.

## 🔍 Features

* Login and signup to the application;
* Books listing and details;

## 💹 Extras

* Push Notifications;
* Multiple languages support;

## 🛠 Technologies

During the development of this project, the following techologies were used:

- [React Native](https://reactnative.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Paper Dates](https://github.com/web-ridge/react-native-paper-dates)
- [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)
- [React Native Document Picker](https://github.com/rnmods/react-native-document-picker)
- [React Native QR Code Scanner](https://github.com/moaazsidat/react-native-qrcode-scanner)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [TypeScript](https://www.typescriptlang.org/)

## 💻 Project Configuration

### First, install the dependencies for the project

```bash
$ yarn
```

## 🌐 Setting up config files

You need to update the API settings file (./src/services/api.ts) according to the base URL for the API used as the backend for the application:

```typescript
import axios from 'axios';

const api = axios.create({
    // Modify regarding the server address and device being used (Android emulator, iOS emulator, etc.)
    baseURL: "http://10.0.2.2:3333",
})

export default api;
```

You must also provide the *google-services.json* file (should be placed in ./android/app/google-services.json) with the Firebase app credentials.

## ⏯️ Running

To run the project in a development environment, execute the following command on the root directory.

```bash
$ # For Android devices
$ yarn android
$ # For iOS devices (on Mac computers only)
$ yarn ios
```

## 🔨 Project's *Build* for *Deploy*

In order to publish the app for the app stores of different kinds of devices (Play Store, App Store), there are some steps to be done.

### Android
Aside from [configuring for app publishing with React Native](https://reactnative.dev/docs/signed-apk-android), we should execute the following commands to generate the *.aab* (Android App Bundle) file:

```bash
$ cd android
$ ./gradlew bundleRelease
```

The generated file will be located at ```android/app/build/outputs/bundle/release/```.

### Documentation:
* [Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)
* [Publishing to Apple App Store](https://reactnative.dev/docs/publishing-to-app-store)
* [Rocketseat Docs | Ambiente React Native](https://react-native.rocketseat.dev/)
* [Reanimated 2 failed to create a worklet, maybe you forgot to add Reanimated's babel plugin?](https://github.com/software-mansion/react-native-reanimated/issues/1875)
* [Internacionalização em React Native](https://medium.com/reactbrasil/internacionaliza%C3%A7%C3%A3o-em-react-native-77fb1a56f8e9)
* [Linking.canOpenURL returning false when targeting android 30 sdk on React Native](https://stackoverflow.com/questions/64699801/linking-canopenurl-returning-false-when-targeting-android-30-sdk-on-react-native)
* [React-Native and Intl polyfill required on Android device](https://stackoverflow.com/questions/41736735/react-native-and-intl-polyfill-required-on-android-device)
* [Firebase Push Notification In React Native](https://medium.com/successivetech/firebase-push-notification-in-react-native-57973ee7c11d)
* [APK signing error : Failed to read key from keystore](https://stackoverflow.com/questions/20453249/apk-signing-error-failed-to-read-key-from-keystore)
* [Android Studio - Keystore was tampered with, or password was incorrect](https://stackoverflow.com/a/66775347)
* [Cloud Messaging | React Native Firebase](https://rnfirebase.io/messaging/usage)
* [react-native-firebase | Pre-defined colors](https://github.com/invertase/react-native-firebase/blob/main/packages/messaging/android/src/main/res/values/colors.xml)

## 📄 License

This project is under the **MIT** license. For more information, access [LICENSE](./LICENSE).
