# React Native Starter Kit - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Configuration Guide](#configuration-guide)
5. [Feature Flags Implementation Guide](#feature-flags-implementation-guide)
6. [Architecture](#architecture)
7. [Components](#components)
8. [Services](#services)
9. [Hooks](#hooks)
10. [API Integration](#api-integration)
11. [Authentication](#authentication)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)
14. [Deployment](#deployment)

---

## Overview

This React Native Starter Kit is a production-ready template that provides a solid foundation for building cross-platform mobile applications. It includes:

- ✅ **Complete Authentication System** (Google, Facebook, Apple, Biometric)
- ✅ **Feature Flags System** for easy feature toggling
- ✅ **Redux State Management** with TypeScript
- ✅ **Navigation** (Stack, Tab, Drawer)
- ✅ **Bluetooth Low Energy (BLE)** support
- ✅ **WiFi Management** capabilities
- ✅ **QR Code Scanner**
- ✅ **Maps & Location Services**
- ✅ **Media Viewer** (Images, Videos, Documents)
- ✅ **Accessibility Features**
- ✅ **Notifications** (Local & Push)
- ✅ **Localization (i18n)** support
- ✅ **Error Handling & Logging**
- ✅ **Version Checking & Update Dialog**
- ✅ **Social Sharing**
- ✅ **Offline Mode Support**

### Tech Stack

- **React Native**: 0.74.3
- **React**: 18.2.0
- **TypeScript**: 5.0.4
- **Redux Toolkit**: 2.2.7
- **React Navigation**: 6.x
- **Firebase**: Authentication, Analytics, Crashlytics
- **Node.js**: >=18

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment set up
  - [iOS Setup](https://reactnative.dev/docs/environment-setup?os=macos&platform=ios)
  - [Android Setup](https://reactnative.dev/docs/environment-setup?os=macos&platform=android)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CharmisG/ReactNative_Starter
   cd template
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro Bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run the app**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

### Initial Configuration

1. **Update App Information**
   - Edit `src/config/AppConfig.ts`
   - Update `AppConfig.name`, `AppConfig.version`
   - Update `StoreConfig` with your app store URLs

2. **Configure Firebase**
   - Add `google-services.json` to `android/app/`
   - Add `GoogleService-Info.plist` to iOS project
   - See [Firebase Setup](#firebase-setup) for details

3. **Configure API Endpoints**
   - Update `UrlConstants.baseUrl` in `src/config/AppConfig.ts`

---

## Project Structure

```
template/
├── src/
│   ├── api/                    # API services and interceptors
│   │   ├── ApiBase.ts
│   │   ├── ApiInterceptor.ts
│   │   └── SampleService.ts
│   ├── assets/                 # Images, fonts, etc.
│   │   └── images/
│   ├── components/             # Reusable components
│   │   ├── accessibility/
│   │   ├── dashboard/
│   │   ├── maps/
│   │   ├── mediaViewer/
│   │   ├── qrScanner/
│   │   ├── settings/
│   │   ├── socialLogin/
│   │   └── textEditor/
│   ├── config/                 # Configuration files
│   │   └── AppConfig.ts        # Main configuration
│   ├── constants/              # App constants
│   │   ├── AppConstants.ts
│   │   ├── EventConstants.ts
│   │   └── StorageKeys.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAppInitialization.ts
│   │   ├── useBLEOperations.ts
│   │   ├── useNotifications.ts
│   │   └── ...
│   ├── Localization/           # i18n translations
│   │   ├── en.json
│   │   ├── es.json
│   │   └── Localize.ts
│   ├── models/                 # TypeScript models
│   ├── navigation/             # Navigation configuration
│   │   ├── MainDrawerNavigator.tsx
│   │   ├── MainStackNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── redux/                  # Redux store and slices
│   │   ├── slices/
│   │   └── Store.ts
│   ├── screens/                # Screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── ...
│   ├── services/               # Business logic services
│   │   ├── NotificationService.ts
│   │   └── VersionService.ts
│   ├── styles/                 # Global styles
│   │   ├── Colors.tsx
│   │   ├── Dimens.tsx
│   │   └── Fonts.tsx
│   └── utils/                  # Utility functions
│       ├── DateFormatter.ts
│       ├── errors/
│       └── ...
├── android/                    # Android native code
├── ios/                        # iOS native code
├── App.tsx                     # Root component
└── package.json
```

---

## Configuration Guide

All configuration is centralized in `src/config/AppConfig.ts`. This single file controls the entire app behavior.

### Configuration Sections

#### 1. API & URL Configuration (`UrlConstants`)

```typescript
export const UrlConstants = {
    baseUrl: 'https://jsonplaceholder.typicode.com/',
    sampleEndpoint: 'todos',
    versionEndpoint: 'api/version',
};
```

**Usage**: Update `baseUrl` to point to your backend API.

#### 2. App Info & Version (`AppConfig`)

```typescript
export const AppConfig = {
    name: 'React Native Starter Kit',
    version: '1.0.0',              // MUST match package.json
    minimumVersion: '1.0.0',
    buildNumber: 1,
};
```

**Important**: `version` must match `package.json` version.

#### 3. Store Configuration (`StoreConfig`)

```typescript
export const StoreConfig = {
    ios: {
        appId: '123456789',
        appName: 'MyApp',
        storeUrl: 'https://apps.apple.com/app/myapp/id123456789',
        bundleId: 'com.mycompany.myapp',
    },
    android: {
        packageName: 'com.saviant.reactstarterkit',
        storeUrl: 'https://play.google.com/store/apps/details?id=...',
    },
};
```

**How to get URLs**:
- **iOS**: App Store → Your App → Share → Copy Link
- **Android**: Play Store → Your App → Share → Copy Link

#### 4. Authentication Configuration (`AuthConfig`)

```typescript
export const AuthConfig = {
    providers: {
        google: {
            webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
            iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
            offlineAccess: false,
            profileImageSize: 150,
        },
    },
    sessionTimeout: 30,  // minutes
    autoLogin: true,
};
```

#### 5. Debug Configuration (`DebugConfig`)

```typescript
export const DebugConfig = {
    logging: __DEV__,              // Auto: true in dev, false in prod
    logApiCalls: __DEV__,
    logReduxActions: __DEV__,
    logNavigation: __DEV__,
    mockApi: {
        enabled: false,
        delay: 500,
    },
    mockVersionUpdate: {
        enabled: false,
        latestVersion: '2.0.0',
        forceUpdate: false,
    },
};
```

#### 6. Firebase Configuration (`FirebaseConfig`)

```typescript
export const FirebaseConfig = {
    crashlytics: {
        enabled: true,
        collectDeviceInfo: true,
        collectSessionId: true,
    },
    analytics: {
        enabled: true,
        analyticsCollectionEnabled: true,
    },
    remoteConfig: {
        enabled: false,
        cacheExpiration: 3600,
    },
};
```

#### 7. Permissions Configuration (`PermissionsConfig`)

```typescript
export const PermissionsConfig = {
    requiredPermissions: [],    // Permissions requested on startup
    optionalPermissions: [],   // Permissions requested on-demand
};
```

---

## Feature Flags Implementation Guide

Feature flags allow you to enable/disable features without code changes. All flags are in `src/config/AppConfig.ts` under `FeatureFlags`.

### How Feature Flags Work

1. **Master Toggle**: Most features have an `enabled` flag that acts as a master switch  
2. **Granular Control**: Many features have sub-flags for fine-grained control  
3. **Runtime Checks**: Code checks flags before executing operations  
4. **No Code Changes**: Toggle features by editing `AppConfig.ts` only

### Table of Contents

1. [Version Checking](#version-checking)
2. [Error Handling](#error-handling)
3. [Offline Mode](#offline-mode)
4. [Local Storage](#local-storage)
5. [Authentication Providers](#authentication-providers)
6. [Biometric Authentication](#biometric-authentication)
7. [Media Picker](#media-picker)
8. [Settings Screen Features](#settings-screen-features)
9. [Social Share](#social-share)
10. [Localization (i18n)](#localization-i18n)
11. [Bluetooth Low Energy (BLE)](#bluetooth-low-energy-ble)
12. [WiFi Management](#wifi-management)
13. [Splash Screen](#splash-screen)
14. [Maps & Location](#maps--location)
15. [Media Viewer](#media-viewer)
16. [Accessibility](#accessibility)
17. [Notifications](#notifications)

### Version Checking

**Configuration Location**: `src/config/AppConfig.ts` (lines 80-85)  
**Implementation Files**: `src/redux/slices/VersionSlice.ts`; `src/hooks/useSettingsScreen.ts` (106-117); `src/components/settings/SettingsCards.tsx` (116)

`useSettingsScreen.ts` (106-117):
```typescript
const onCheckAppVersion = useCallback(async () => {
  try {
    showToast({ text: 'Checking for app updates...', type: 'info' });
    await dispatch(VersionSliceActions.checkVersionUpdate());
    const now = new Date();
    setLastVersionCheck(now);
    await setItem(StorageKeys.LAST_VERSION_CHECK, now.toISOString());
  } catch (error) {
    console.error('Version check failed', error);
    showToast({ text: 'Failed to check for updates', type: 'error' });
  }
}, [dispatch]);
```

**How to Use**: Enable `FeatureFlags.versionChecking.enabled = true`; adjust `checkInterval`; call `VersionSliceActions.checkVersionUpdate()` or rely on startup.

### Error Handling

**Configuration Location**: `src/config/AppConfig.ts` (88-93)  
**Implementation Files**: `src/utils/errors/ErrorHandler.ts`; `src/utils/errors/ErrorLogger.ts`; `src/utils/errors/ErrorMessages.ts`; `src/components/ErrorBoundary.tsx`

**How to Use**: `errorHandler.handleError(error, { source: 'Component', action: 'actionName' });` (App wrapped by `ErrorBoundary`).

### Offline Mode

**Configuration Location**: `src/config/AppConfig.ts` (96-99)  
**Implementation Files**: `src/api/ApiBase.ts` (cache logic); Redux middleware (store setup)

**How to Use**: Enable `FeatureFlags.offlineMode.enabled`; set `cacheTimeout`.

### Local Storage

**Configuration Location**: `src/config/AppConfig.ts` (102-106)  
**Implementation Files**: `src/components/localStorage.ts`; `src/constants/StorageKeys.ts`

```typescript
import { getItem, setItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';
await setItem(StorageKeys.SELECTED_LANGUAGE, 'es');
const language = await getItem(StorageKeys.SELECTED_LANGUAGE);
```

### Authentication Providers

**Configuration Location**: `src/config/AppConfig.ts` (109-114)  
**Implementation Files**: `src/screens/LoginScreen.tsx`; `src/components/socialLogin/SocialLoginSection.tsx`; `src/components/socialLogin/googleLogin.tsx`; `src/components/socialLogin/facebookLogin.tsx`; `src/components/socialLogin/BiometricButton.tsx`; `src/hooks/useLoginScreen.ts`

### Biometric Authentication

**Configuration Location**: `src/config/AppConfig.ts` (117-124)  
**Implementation Files**: `src/utils/BiometricAuth.ts`; `src/hooks/useBiometricAuth.ts`; `src/components/socialLogin/BiometricButton.tsx`; `src/hooks/useLoginScreen.ts`  
**How to Use**: Enable `FeatureFlags.biometric.enabled`; use `useBiometricAuth()` in components.

### Media Picker

**Configuration Location**: `src/config/AppConfig.ts` (127-130)  
**Implementation Files**: `src/hooks/useSettingsScreen.ts` (136-144); `src/components/settings/SettingsCards.tsx` (157-181)

### Settings Screen Features

**Configuration Location**: `src/config/AppConfig.ts` (133-146)  
**Implementation Files**: `src/components/settings/SettingsCards.tsx`; `src/components/settings/CurrencyExampleCard.tsx`; `src/components/settings/DateTimeExampleCard.tsx`; `src/components/settings/UnitsExampleCard.tsx`

### Social Share

**Configuration Location**: `src/config/AppConfig.ts` (149-163)  
**Implementation Files**: `src/hooks/useSocialShare.ts`; `src/utils/SocialShare.ts`; `src/components/settings/ShareButton.tsx`; `src/hooks/useSettingsScreen.ts` (line 38)

### Localization (i18n)

**Configuration Location**: `src/config/AppConfig.ts` (166-171)  
**Implementation Files**: `src/Localization/Localize.ts`; `src/hooks/Translate.tsx`; `src/hooks/useAppInitialization.ts` (246-327); `src/hooks/useSettingsScreen.ts` (language handlers); `src/Localization/en.json`; `src/Localization/es.json`  
**How to Use**: Enable `FeatureFlags.localization.enabled`; add languages to `supportedLanguages`; add `[lang].json` and register in `Localize.ts`.

### Bluetooth Low Energy (BLE)

**Configuration Location**: `src/config/AppConfig.ts` (174-186)  
**Implementation Files**: `src/components/screenTwo/BLESection.tsx`; `src/hooks/useBLEOperations.ts`; `src/redux/slices/BTPeripheralSlice.ts`; `src/screens/ScreenTwo.tsx`

### WiFi Management

**Configuration Location**: `src/config/AppConfig.ts` (189-201)  
**Implementation Files**: `src/components/screenTwo/WiFiSection.tsx`; `src/hooks/useWiFiOperations.ts`; `src/utils/WiFiManager.ts`; `src/hooks/useWiFiMonitoring.ts`; `src/redux/slices/WiFiSlice.ts`; `src/components/screenTwo/WiFiPasswordModal.tsx`

### Splash Screen

**Configuration Location**: `src/config/AppConfig.ts` (204-208)  
**Implementation Files**: `App.tsx` (39-56)

### Maps & Location

**Configuration Location**: `src/config/AppConfig.ts` (211-221)  
**Implementation Files**: `src/screens/MapsScreen.tsx`; `src/hooks/useLocation.ts`; `src/hooks/useDashboardScreen.ts`

### Media Viewer

**Configuration Location**: `src/config/AppConfig.ts` (224-243)  
**Implementation Files**: `src/hooks/useMediaViewer.ts`; `src/screens/MediaViewerScreen.tsx`; `src/hooks/useMediaViewerScreen.ts`; `src/components/mediaViewer/MediaDisplay.tsx`; `src/components/mediaViewer/MediaViewerComponents.tsx`; `src/hooks/useDashboardScreen.ts`

### Accessibility

**Configuration Location**: `src/config/AppConfig.ts` (246-255)  
**Implementation Files**: `src/screens/AccessibilityScreen.tsx`; `src/hooks/useAccessibilityScreen.ts`; `src/components/accessibility/AccessibilityComponents.tsx`; `src/hooks/useDashboardScreen.ts`

### Notifications

**Configuration Location**: `src/config/AppConfig.ts` (258-267)  
**Implementation Files**: `src/hooks/useNotifications.ts`; `src/services/NotificationService.ts`; `src/hooks/useSettingsScreen.ts`; `src/components/settings/SettingsCards.tsx`

### Quick Reference: File Locations Summary

| Feature | Config Lines | Main Implementation File | Lines to Copy |
|---------|-------------|-------------------------|---------------|
| Version Checking | 80-85 | `src/redux/slices/VersionSlice.ts` | 1-150 (entire file) |
| Error Handling | 88-93 | `src/utils/errors/ErrorHandler.ts` | 1-200 (entire file) |
| Local Storage | 102-106 | `src/components/localStorage.ts` | 1-50 (entire file) |
| Biometric Auth | 117-124 | `src/hooks/useBiometricAuth.ts` | 1-112 (entire file) |
| Social Share | 149-163 | `src/hooks/useSocialShare.ts` | 1-105 (entire file) |
| Localization | 166-171 | `src/hooks/Translate.tsx` | 1-7 (entire file) |
| Bluetooth | 174-186 | `src/hooks/useBLEOperations.ts` | 1-200 (entire file) |
| WiFi | 189-201 | `src/hooks/useWiFiOperations.ts` | 1-107 (entire file) |
| Maps | 211-221 | `src/hooks/useLocation.ts` | 1-253 (entire file) |
| Media Viewer | 224-243 | `src/hooks/useMediaViewer.ts` | 1-188 (entire file) |
| Accessibility | 246-255 | `src/hooks/useAccessibilityScreen.ts` | 1-150 (entire file) |
| Notifications | 258-267 | `src/hooks/useNotifications.ts` | 1-138 (entire file) |

### General Implementation Pattern

1. **Enable in Config** (`src/config/AppConfig.ts`)
   ```typescript
   featureName: {
       enabled: true,
       // ... other config
   }
   ```
2. **Import Feature Flag**
   ```typescript
   import { FeatureFlags } from '../config/AppConfig';
   const isFeatureEnabled = FeatureFlags.featureName?.enabled ?? false;
   ```
3. **Check Before Use**
   ```typescript
   if (!isFeatureEnabled) {
       return; // or show disabled message
   }
   ```
4. **Import and Use Hook**
   ```typescript
   import { useFeatureName } from '../hooks/useFeatureName';
   const { /* hook methods */ } = useFeatureName();
   ```
5. **Add to Navigation** (if screen-based)
   - Add route in `src/navigation/NavParamTypes.tsx`
   - Add screen in `src/navigation/MainStackNavigator.tsx`
   - Add to dashboard menu in `src/hooks/useDashboardScreen.ts`

### Best Practices

1. Always check `enabled` first  
2. Use optional chaining `?.` and nullish coalescing `??`  
3. Restart app after flag changes  
4. Confirm native/permission dependencies  
5. Review console logs in development

### Common Issues & Solutions

**Feature not showing up**: ensure `enabled: true`; add to navigation/menu; restart app.  
**Feature not working**: check permissions/native linkage; review console; ensure flag guards exist.  
**Language not changing**: confirm `localization.enabled`; ensure translation files; clear saved preference; check logs.


## Architecture

### State Management

The app uses **Redux Toolkit** for state management.

#### Redux Slices

- **HomeSlice**: Home screen state
- **SettingsSlice**: App settings (theme, etc.)
- **VersionSlice**: Version checking state
- **BTPeripheralSlice**: Bluetooth devices state
- **WiFiSlice**: WiFi networks state

#### Store Configuration

```typescript
// src/redux/Store.ts
import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/HomeSlice';
import settingsReducer from './slices/SettingsSlice';
// ... other reducers

export const store = configureStore({
  reducer: {
    Home: homeReducer,
    Settings: settingsReducer,
    // ... other reducers
  },
});
```

### Navigation

The app uses **React Navigation** with three navigation types:

1. **Stack Navigator**: Main navigation (`MainStackNavigator.tsx`)
2. **Tab Navigator**: Bottom tabs (`MainTabNavigator.tsx`)
3. **Drawer Navigator**: Side drawer (`MainDrawerNavigator.tsx`)

### Component Architecture

```
Screen Component
    ↓
Custom Hook (useScreenName.ts)
    ↓
Redux Store / Services
    ↓
API / Native Modules
```

### Error Handling

Centralized error handling via:
- `ErrorHandler`: Catches and processes errors
- `ErrorLogger`: Logs errors to file/external service
- `ErrorBoundary`: React error boundary component

---

## Components

### Core Components

#### MainView
Wrapper component for all screens with consistent styling.

```typescript
<MainView screenTitle="Dashboard" leftIconPressed={() => navigation.goBack()}>
  {/* Screen content */}
</MainView>
```

#### LoadingIndicator
Shows loading state.

```typescript
<LoadingIndicator visible={isLoading} />
```

#### Toast
Toast notifications.

```typescript
import { showToast } from '../components/ToastContext';

showToast({ text: 'Success!', type: 'success' });
```

### Feature Components

#### SocialLoginSection
Handles Google, Facebook, Apple, and Biometric login.

#### SettingsCards
Displays settings screen cards with feature flag control.

#### UpdateDialog
Shows app update dialog when new version is available.

---

## Services

### NotificationService

Manages local notifications.

```typescript
import NotificationService from '../services/NotificationService';

// Send notification
await NotificationService.sendNotification('Title', 'Body');

// Schedule notification
await NotificationService.scheduleNotification(
  'Title',
  'Body',
  new Date(Date.now() + 60000) // 1 minute from now
);
```

### VersionService

Checks for app updates.

```typescript
import { VersionService } from '../services/VersionService';

const updateInfo = await VersionService.checkVersionUpdate();
```

---

## Hooks

### Custom Hooks

#### useAppInitialization
Handles app initialization (localization, theme, etc.)

#### useNotifications
Manages notification permissions and sending.

```typescript
const { sendTestNotification, hasPermission, requestPermission } = useNotifications();
```

#### useBLEOperations
Handles Bluetooth Low Energy operations.

```typescript
const { scanForDevices, connectToDevice, disconnectDevice } = useBLEOperations();
```

#### useWiFiOperations
Manages WiFi connections.

```typescript
const { scanForNetworks, connectToNetwork } = useWiFiOperations();
```

#### useLocation
Manages location services.

```typescript
const { currentLocation, startTracking, stopTracking } = useLocation();
```

---

## API Integration

### API Base Configuration

```typescript
// src/api/ApiBase.ts
import axios from 'axios';
import { UrlConstants } from '../config/AppConfig';

const api = axios.create({
  baseURL: UrlConstants.baseUrl,
  timeout: 10000,
});
```

### API Interceptor

Handles request/response interception, error handling, and token management.

### Creating New API Services

```typescript
// src/api/UserService.ts
import api from './ApiBase';

export const UserService = {
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
};
```

---

## Authentication

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication → Sign-in methods

2. **Android Setup**
   - Add Android app in Firebase Console
   - Download `google-services.json`
   - Place in `android/app/google-services.json`
   - Add to `android/build.gradle`:
     ```gradle
     dependencies {
         classpath 'com.google.gms:google-services:4.4.2'
     }
     ```
   - Add to `android/app/build.gradle`:
     ```gradle
     apply plugin: 'com.google.gms.google-services'
     ```

3. **iOS Setup**
   - Add iOS app in Firebase Console
   - Download `GoogleService-Info.plist`
   - Add to Xcode project
   - Run `cd ios && pod install`

### Google Sign-In

1. **Get Client IDs**
   - Firebase Console → Authentication → Sign-in method → Google
   - Get Web Client ID and iOS Client ID

2. **Configure AppConfig**
   ```typescript
   AuthConfig.providers.google = {
     webClientId: 'YOUR_WEB_CLIENT_ID',
     iosClientId: 'YOUR_IOS_CLIENT_ID',
   };
   ```

### Facebook Sign-In

1. **Create Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create app → Add Facebook Login

2. **Configure Firebase**
   - Add App ID and App Secret to Firebase Authentication

3. **Android Configuration**
   - Add to `android/app/src/main/res/values/strings.xml`:
     ```xml
     <string name="facebook_app_id">YOUR_APP_ID</string>
     <string name="facebook_client_token">YOUR_CLIENT_TOKEN</string>
     ```

4. **iOS Configuration**
   - Add to `Info.plist`:
     ```xml
     <key>FacebookAppID</key>
     <string>YOUR_APP_ID</string>
     ```

### Apple Sign-In

1. **Enable in Xcode**
   - Target → Signing & Capabilities → Add Capability → Sign in with Apple

2. **Configure in Firebase**
   - Enable Apple in Firebase Authentication

### Biometric Authentication

Uses device biometrics (Face ID, Touch ID, Fingerprint).

```typescript
// Enable in FeatureFlags
FeatureFlags.biometric.enabled = true;
FeatureFlags.authProviders.biometric = true;
```

---

## Best Practices

### Code Organization

1. **Keep components small**: One component, one responsibility
2. **Use custom hooks**: Extract reusable logic
3. **Type everything**: Use TypeScript types/interfaces
4. **Centralize config**: Use `AppConfig.ts` for all configuration

### Performance

1. **Use React.memo**: Memoize expensive components
2. **Lazy loading**: Load screens/components on demand
3. **Image optimization**: Use `react-native-fast-image`
4. **List optimization**: Use `FlatList` with proper `keyExtractor`

### Security

1. **Never commit secrets**: Use environment variables
2. **Validate inputs**: Always validate user inputs
3. **Secure storage**: Use secure storage for sensitive data
4. **HTTPS only**: Always use HTTPS for API calls

### Testing

1. **Unit tests**: Test utility functions
2. **Component tests**: Test component rendering
3. **Integration tests**: Test user flows
4. **E2E tests**: Test complete scenarios

---

## Troubleshooting

### Common Issues

#### Metro Bundler Issues

```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all
```

#### Android Build Issues

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Gradle cache
rm -rf ~/.gradle/caches/
```

#### iOS Build Issues

```bash
# Clean iOS build
cd ios
rm -rf build/
pod deintegrate
pod install
cd ..

# Clear Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### Dependency Issues

```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# iOS pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Feature Flag Not Working

1. **Check flag is enabled**: Verify in `AppConfig.ts`
2. **Restart app**: Flags are read on app start
3. **Check code**: Ensure code checks the flag
4. **Check console**: Look for flag-related warnings

### Permission Issues

1. **Android**: Check `AndroidManifest.xml` for permissions
2. **iOS**: Check `Info.plist` for permission descriptions
3. **Runtime**: Request permissions before use

---

## Deployment

### Pre-Deployment Checklist

- [ ] Update `AppConfig.version` to match `package.json`
- [ ] Set production API URL in `UrlConstants.baseUrl`
- [ ] Configure store URLs in `StoreConfig`
- [ ] Disable debug mode: `DebugConfig.logging = false`
- [ ] Disable mock features
- [ ] Review all feature flags
- [ ] Test on both iOS and Android
- [ ] Update app icons and splash screens
- [ ] Configure Firebase for production
- [ ] Set up crash reporting
- [ ] Test authentication flows
- [ ] Verify all permissions are requested

### Android Release

1. **Generate Keystore**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Gradle**
   - Add signing config to `android/app/build.gradle`

3. **Build Release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Build Release AAB** (for Play Store)
   ```bash
   ./gradlew bundleRelease
   ```

### iOS Release

1. **Configure in Xcode**
   - Select target → Signing & Capabilities
   - Choose your team and provisioning profile

2. **Archive**
   - Product → Archive

3. **Distribute**
   - Distribute App → App Store Connect

### CI/CD

See `.github/workflows/` for GitHub Actions workflows:
- `ci-cd.yml`: Main CI/CD pipeline
- `release.yml`: Release workflow

---

## Additional Resources

### Documentation Files

- `FEATURE_FLAGS.md`: Detailed feature flags reference
- `CONFIGURABLE_GUIDE.md`: Configuration guide
- `DATE_TIME_LOCALIZATION.md`: Date/time formatting guide
- `UNITS_MEASUREMENTS_GUIDE.md`: Units and measurements guide
- `UPDATE_SETUP_GUIDE.md`: Version update setup
- `WIFI_CONNECTION_TROUBLESHOOTING.md`: WiFi troubleshooting

### External Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Firebase Docs](https://firebase.google.com/docs)

---

## Support

For issues, questions, or contributions:

1. Check existing documentation
2. Review feature flags configuration
3. Check troubleshooting section
4. Review code comments
5. Open an issue on the repository

---

**Last Updated**: 2024
**Version**: 1.0.0

