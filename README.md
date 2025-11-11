This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!


## Login with Google using Firebase Authentication:

### ⚙️ Setup Guide
1. Create a Firebase Project
Go to the [Firebase Console]((https://console.firebase.google.com/))
Click Add Project and follow the steps.
Navigate to Authentication → Sign-in method.
Enable Google as a provider.

2. Add Firebase to Your React Native App

- Install dependencies

   ```bash
   npm install @react-native-firebase/app @react-native-firebase/auth
   npm install @react-native-google-signin/google-signin
   ```

### 🔹 Android setup

1) In Firebase Console → Project Settings → Android app, register your app (e.g. com.example.myapp).

2) Download google-services.json and place it in:
   android/app/google-services.json

3) Add Firebase plugin to your android/build.gradle:

   ```bash
   buildscript {
      dependencies {
         classpath 'com.google.gms:google-services:4.4.2'
      }
   }
   ```

4) Apply the plugin at the bottom of android/app/build.gradle:

```bash
   apply plugin: 'com.google.gms.google-services'
   ```

5) Add your SHA-1 and SHA-256 keys in Firebase → Project Settings → Android App.
- To get them, run:

```bash
   cd android && ./gradlew signingReport
   ```

### 🔹 For iOS:

1) In Firebase Console → Project Settings → iOS app, register your iOS bundle ID (e.g. com.example.myapp).

2) Download GoogleService-Info.plist and add it to your Xcode project.

3) Run:
```bash
   cd ios && pod install
```

4) Configure URL types in Xcode:
- Open your project in Xcode.
- Select your app target → Info → URL Types.
- Add a new URL type with the value from REVERSED_CLIENT_ID in GoogleService-Info.plist.

## 💻 Implementation
- working example using Firebase Authentication with Google Sign-In is in :
   src/components/socialLogin/googleLogin.tsx

## Login with Facebook using Firebase Authentication:

### ⚙️ Setup Guide
1. Create a Firebase Project

- Go to the [Firebase Console]((https://console.firebase.google.com/))
- Click Add Project and follow the setup steps.
- Go to Authentication → Sign-in method.
- Enable Facebook as a provider.
- Copy your App ID and App Secret from Facebook Developer Dashboard.

2. Create a Facebook App

- Go to [Facebook for Developers](https://developers.facebook.com/)
- Click My Apps → Create App.
- Choose Consumer and set up your app.
- In Facebook Login → Settings, add your OAuth redirect URI from Firebase:
   https://<your-project-id>.firebaseapp.com/__/auth/handler   
- Copy the App ID and App Secret and paste them into Firebase Authentication → Facebook Provider Settings.

3. Add Firebase and Facebook SDKs to React Native

- Install Dependencies

```bash
   npm install @react-native-firebase/app @react-native-firebase/auth react-native-fbsdk-next
```

### 🔹 Android Setup

- In Firebase Console → Project Settings → Android, register your Android package name (e.g. com.example.myapp).

- Download google-services.json and put it inside:
   android/app/google-services.json

- Add Firebase plugin to your android/build.gradle:

   ```bash
   buildscript {
      dependencies {
      classpath 'com.google.gms:google-services:4.4.2'
       }
   }
   ```

- Apply plugin at the bottom of android/app/build.gradle:
   apply plugin: 'com.google.gms.google-services'

- Add your Facebook App ID and client token in android/app/src/main/AndroidManifest.xml:

 ```bash

   <application>
      <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
      <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
   </application>

```

- Add these values to android/app/src/main/res/values/strings.xml:

```bash
   <string name="facebook_app_id">YOUR_FACEBOOK_APP_ID</string>
   <string name="facebook_client_token">YOUR_FACEBOOK_CLIENT_TOKEN</string>
```

### 🔹 iOS Setup

1) In Firebase Console → Project Settings → iOS app, register your bundle ID.
2) Download GoogleService-Info.plist and add it to your Xcode project.
3) Install CocoaPods:
   ```bash
      cd ios && pod install
   ```
4) Configure Facebook:
```bash
   Add your Facebook App ID and Display Name to Info.plist:
   <key>FacebookAppID</key>
   <string>YOUR_FACEBOOK_APP_ID</string>
   <key>FacebookDisplayName</key>
   <string>YOUR_APP_NAME</string>
   <key>LSApplicationQueriesSchemes</key>
   <array>
      <string>fbapi</string>
      <string>fbapi20130214</string>
      <string>fbapi20130410</string>
      <string>fbapi20130702</string>
      <string>fbapi20131010</string>
      <string>fbapi20131219</string>
      <string>fbapi20140410</string>
      <string>fbapi20140116</string>
      <string>fbapi20150313</string>
      <string>fbapi20150629</string>
      <string>fbapi20160328</string>
      <string>fbauth2</string>
   </array>
   <key>CFBundleURLTypes</key>
   <array>
      <dict>
         <key>CFBundleURLSchemes</key>
         <array>
               <string>fbYOUR_FACEBOOK_APP_ID</string>
         </array>
      </dict>
   </array>
```

 ### 💻 Implementation
- working example using Firebase Authentication with Facebook Sign-In is in :
   src/components/socialLogin/facebookLogin.tsx

## Once you’ve obtained an access token from a social login (e.g., Google, Facebook, Apple, etc.) in a mobile app, the next steps are critical to properly authenticate the user and integrate them into your backend system securely.

Here’s a step-by-step guide on what to do next 👇

## 1. Send the Access Token to Your Backend

Why: The access token should not be trusted directly by the client app for authentication with your own backend.

How:

- Make a secure HTTPS POST request to your backend API endpoint, e.g.:

```bash
POST /api/auth/social-login
{
  "provider": "google",
  "access_token": "<SOCIAL_ACCESS_TOKEN>"
}
```

- Include necessary metadata (e.g., app version, device info if needed).

## 2. Verify the Token on the Server

Your backend must validate the access token with the social provider (Google, Facebook, etc.) to ensure it’s legitimate.

Example:

- For Google, call
```bash
https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=<token>
```

- For Facebook, call
```bash
https://graph.facebook.com/debug_token?input_token=<token>&access_token=<app_access_token>
```

- For Apple, verify the JWT signature using Apple’s public keys.
- Extract the user ID, email, and name from the verified payload. 

## 👤 3. Create or Fetch a Local User Account

- Check if a user with that social account already exists in your database.

If not:

Create a new user record with their social ID, name, and email.

If yes:

Fetch the existing user record.


## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.