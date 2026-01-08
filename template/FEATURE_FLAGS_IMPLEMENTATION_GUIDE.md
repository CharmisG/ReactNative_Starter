# Feature Flags Implementation Guide

This guide provides detailed information on how to implement and use each configurable feature flag in the application. For each feature, you'll find:
- Configuration location (file and line numbers)
- Implementation files to reference
- Code sections to copy/adapt
- Step-by-step implementation instructions

---

## Table of Contents

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

---

## Version Checking

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 80-85

```typescript
versionChecking: {
    enabled: true,
    checkOnStartup: true,
    checkInterval: 24 * 60 * 60 * 1000, // 24 hours
    showDialogAutomatically: true,
},
```

### Implementation Files
1. **Redux Slice:** `src/redux/slices/VersionSlice.ts` (entire file)
2. **Hook Usage:** `src/hooks/useSettingsScreen.ts` (lines 106-117)
3. **Settings Component:** `src/components/settings/SettingsCards.tsx` (line 116)

### Code to Reference

**VersionSlice.ts** - Check lines 1-150 (entire file)
- Contains `checkVersionUpdate` thunk
- Handles version checking logic
- Shows update dialog

**useSettingsScreen.ts** - Lines 106-117
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

### How to Use
1. Enable in `AppConfig.ts`: Set `versionChecking.enabled = true`
2. Configure check interval: Modify `checkInterval` value
3. The version check runs automatically on app startup if `checkOnStartup: true`
4. Use `VersionSliceActions.checkVersionUpdate()` to manually trigger check

---

## Error Handling

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 88-93

```typescript
errorHandling: {
    enabled: true,
    logToFile: false,
    logToExternal: false,
    captureConsole: true,
},
```

### Implementation Files
1. **Error Handler:** `src/utils/errors/ErrorHandler.ts` (entire file)
2. **Error Logger:** `src/utils/errors/ErrorLogger.ts` (entire file)
3. **Error Messages:** `src/utils/errors/ErrorMessages.ts` (entire file)
4. **Error Boundary:** `src/components/ErrorBoundary.tsx` (entire file)

### Code to Reference

**ErrorHandler.ts** - Lines 1-200 (entire file)
- Main error handling utility
- Check `handleError()` method usage

**ErrorBoundary.tsx** - Lines 1-141 (entire file)
- React error boundary component
- Catches component tree errors

### How to Use
1. Import error handler: `import { errorHandler } from '../utils/errors/ErrorHandler';`
2. Wrap errors: `errorHandler.handleError(error, { source: 'ComponentName', action: 'actionName' });`
3. Wrap app with ErrorBoundary in `App.tsx` (already done)

---

## Offline Mode

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 96-99

```typescript
offlineMode: {
    enabled: true,
    cacheTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
},
```

### Implementation Files
1. **API Base:** `src/api/ApiBase.ts` (check for cache logic)
2. **Redux Middleware:** Check for offline middleware in Redux store

### Code to Reference
- Check API calls for cache implementation
- Reference Redux store configuration for offline middleware

### How to Use
1. Enable in `AppConfig.ts`: Set `offlineMode.enabled = true`
2. Configure cache timeout: Modify `cacheTimeout` value
3. API calls will automatically cache responses when enabled

---

## Local Storage

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 102-106

```typescript
localStorage: {
    enabled: true,
    keyPrefix: 'app_',
    crashOnDisabled: false,
},
```

### Implementation Files
1. **Local Storage Helper:** `src/components/localStorage.ts` (entire file, ~50 lines)
2. **Storage Keys:** `src/constants/StorageKeys.ts` (entire file, ~35 lines)

### Code to Reference

**localStorage.ts** - Lines 1-50 (entire file)
```typescript
import { getItem, setItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';

// Usage example:
await setItem(StorageKeys.SELECTED_LANGUAGE, 'es');
const language = await getItem(StorageKeys.SELECTED_LANGUAGE);
```

### How to Use
1. Import: `import { getItem, setItem } from '../components/localStorage';`
2. Import keys: `import { StorageKeys } from '../constants/StorageKeys';`
3. Use: `await setItem(StorageKeys.KEY_NAME, value);`
4. Read: `const value = await getItem(StorageKeys.KEY_NAME);`

---

## Authentication Providers

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 109-114

```typescript
authProviders: {
    google: true,
    facebook: true,
    apple: true,
    biometric: true,
},
```

### Implementation Files
1. **Login Screen:** `src/screens/LoginScreen.tsx` (entire file, ~97 lines)
2. **Social Login Section:** `src/components/socialLogin/SocialLoginSection.tsx` (entire file)
3. **Google Login:** `src/components/socialLogin/googleLogin.tsx` (entire file)
4. **Facebook Login:** `src/components/socialLogin/facebookLogin.tsx` (entire file)
5. **Biometric Button:** `src/components/socialLogin/BiometricButton.tsx` (entire file)
6. **Login Hook:** `src/hooks/useLoginScreen.ts` (entire file)

### Code to Reference

**SocialLoginSection.tsx** - Lines 1-100 (entire file)
- Renders social login buttons
- Checks `FeatureFlags.authProviders` for each provider

**useLoginScreen.ts** - Lines 1-200 (entire file)
- Handles login logic
- Checks biometric availability
- Manages authentication state

### How to Use
1. Enable providers in `AppConfig.ts`: Set `authProviders.google = true`, etc.
2. The login screen automatically shows/hides buttons based on flags
3. No additional code needed - already implemented

---

## Biometric Authentication

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 117-124

```typescript
biometric: {
    enabled: true,
    allowDeviceCredentials: true,
    promptMessage: 'Authenticate to login',
    cancelButtonText: 'Cancel',
    showPrompt: true,
    saveCredentials: true,
},
```

### Implementation Files
1. **Biometric Auth Utility:** `src/utils/BiometricAuth.ts` (entire file, ~150 lines)
2. **Biometric Hook:** `src/hooks/useBiometricAuth.ts` (entire file, ~112 lines)
3. **Biometric Button:** `src/components/socialLogin/BiometricButton.tsx` (entire file)
4. **Login Hook:** `src/hooks/useLoginScreen.ts` (lines 20-30, 50-80)

### Code to Reference

**BiometricAuth.ts** - Lines 1-150 (entire file)
```typescript
// Key methods:
- authenticate()
- isAvailable()
- getSupportedType()
```

**useBiometricAuth.ts** - Lines 1-112 (entire file)
```typescript
// Returns:
- hasBiometric
- isAuthenticating
- authenticate()
```

**useLoginScreen.ts** - Lines 20-30, 50-80
```typescript
const { hasBiometric, isAuthenticating, authenticate } = useBiometricAuth();
```

### How to Use
1. Enable in `AppConfig.ts`: Set `biometric.enabled = true`
2. Import hook: `import { useBiometricAuth } from '../hooks/useBiometricAuth';`
3. Use in component: `const { hasBiometric, authenticate } = useBiometricAuth();`
4. Call: `await authenticate();`

---

## Media Picker

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 127-130

```typescript
mediaPicker: {
    camera: true,
    gallery: true,
},
```

### Implementation Files
1. **Settings Screen Hook:** `src/hooks/useSettingsScreen.ts` (lines 136-144)
2. **Settings Cards:** `src/components/settings/SettingsCards.tsx` (lines 157-181)

### Code to Reference

**useSettingsScreen.ts** - Lines 136-144
```typescript
const onPickImageFromLibrary = useCallback(async () => {
  const result = await launchImageLibrary({ 
    mediaType: 'photo', 
    quality: 0.7, 
    selectionLimit: 1 
  });
  if (!result.didCancel) handleImagePickerResult(result.assets, result.errorMessage);
}, [handleImagePickerResult]);

const onCaptureImageWithCamera = useCallback(async () => {
  const result = await launchCamera({ 
    mediaType: 'photo', 
    quality: 0.7, 
    saveToPhotos: true, 
    cameraType: 'back' 
  });
  if (!result.didCancel) handleImagePickerResult(result.assets, result.errorMessage);
}, [handleImagePickerResult]);
```

### How to Use
1. Enable in `AppConfig.ts`: Set `mediaPicker.camera = true` or `mediaPicker.gallery = true`
2. Import: `import { launchImageLibrary, launchCamera } from 'react-native-image-picker';`
3. Use the code from `useSettingsScreen.ts` lines 136-144

---

## Settings Screen Features

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 133-146

```typescript
settingsScreen: {
    showCurrencyExample: false,
    showDateTimeExample: false,
    showUnitsExample: false,
    showSocialShare: true,
    dateTimeExample: { ... },
    showLastVersionCheck: true,
},
```

### Implementation Files
1. **Settings Cards:** `src/components/settings/SettingsCards.tsx` (entire file, ~200 lines)
2. **Currency Card:** `src/components/settings/CurrencyExampleCard.tsx` (entire file)
3. **DateTime Card:** `src/components/settings/DateTimeExampleCard.tsx` (entire file)
4. **Units Card:** `src/components/settings/UnitsExampleCard.tsx` (entire file)

### Code to Reference

**SettingsCards.tsx** - Lines 50-200 (entire file)
- Check for conditional rendering based on flags
- Example: `{FeatureFlags.settingsScreen?.showCurrencyExample && <CurrencyExampleCard />}`

### How to Use
1. Enable features in `AppConfig.ts`: Set flags to `true`
2. Cards automatically show/hide based on flags
3. No additional code needed

---

## Social Share

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 149-163

```typescript
socialShare: {
    enabled: true,
    shareAppName: true,
    shareAppStoreLinks: true,
    shareMessage: 'Check out this amazing app!',
    shareTitle: 'Share App',
    platforms: {
        whatsapp: true,
        facebook: true,
        twitter: true,
        email: true,
        sms: true,
        clipboard: true,
    },
},
```

### Implementation Files
1. **Social Share Hook:** `src/hooks/useSocialShare.ts` (entire file, ~105 lines)
2. **Social Share Utility:** `src/utils/SocialShare.ts` (entire file, ~200 lines)
3. **Share Button:** `src/components/settings/ShareButton.tsx` (entire file)
4. **Settings Hook:** `src/hooks/useSettingsScreen.ts` (line 38)

### Code to Reference

**useSocialShare.ts** - Lines 1-105 (entire file)
```typescript
import { useSocialShare } from '../hooks/useSocialShare';

const { share, shareToPlatform, showShareOptions, isSharing } = useSocialShare();

// Usage:
await share('Custom message', 'Title');
await shareToPlatform('whatsapp', 'Message');
await showShareOptions('Message');
```

**SocialShare.ts** - Lines 1-200 (entire file)
- Contains platform-specific sharing implementations
- Check platform availability

### How to Use
1. Enable in `AppConfig.ts`: Set `socialShare.enabled = true`
2. Enable platforms: Set `platforms.whatsapp = true`, etc.
3. Import hook: `import { useSocialShare } from '../hooks/useSocialShare';`
4. Use: `const { share } = useSocialShare(); await share('Message');`

---

## Localization (i18n)

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 166-171

```typescript
localization: {
    enabled: true,
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    autoDetectDevice: true,
},
```

### Implementation Files
1. **Localization Config:** `src/Localization/Localize.ts` (entire file, ~19 lines)
2. **Translation Hook:** `src/hooks/Translate.tsx` (entire file, ~7 lines)
3. **App Initialization:** `src/hooks/useAppInitialization.ts` (lines 246-327)
4. **Settings Hook:** `src/hooks/useSettingsScreen.ts` (lines 31-33, 41-43, 53-63, 65-80)
5. **Translation Files:** 
   - `src/Localization/en.json` (entire file, ~279 lines)
   - `src/Localization/es.json` (entire file, ~276 lines)

### Code to Reference

**Translate.tsx** - Lines 1-7 (entire file)
```typescript
import Translate from '../hooks/Translate';

// Usage:
<Text>{Translate('Hello')}</Text>
```

**useAppInitialization.ts** - Lines 246-327
- Initializes localization on app start
- Detects timezone and sets language
- Saves language preference

**useSettingsScreen.ts** - Lines 65-80
```typescript
const onLanguageChanged = useCallback(async (val: string) => {
  if (!localizationEnabled || !supportedLanguages.includes(val)) {
    return;
  }
  i18n.changeLanguage(val);
  global.appLanguage = val;
  setSelectedLanguage(val);
  await setItem(StorageKeys.SELECTED_LANGUAGE, val);
}, [localizationEnabled, supportedLanguages]);
```

### How to Use
1. Enable in `AppConfig.ts`: Set `localization.enabled = true`
2. Add languages: Add to `supportedLanguages` array
3. Create translation file: `src/Localization/[lang].json`
4. Import in `Localize.ts`: `import [lang] from './[lang].json';`
5. Add to resources in `Localize.ts`: `resources: { en: { translation: en.translation }, [lang]: { translation: [lang].translation } }`
6. Use in components: `import Translate from '../hooks/Translate';` then `Translate('Key')`

---

## Bluetooth Low Energy (BLE)

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 174-186

```typescript
bluetooth: {
    enabled: true,
    autoStart: true,
    showAlert: false,
    scanDuration: 5,
    requestPermissions: true,
    features: {
        scanning: true,
        connecting: true,
        disconnecting: true,
        stateMonitoring: true,
    },
},
```

### Implementation Files
1. **BLE Section Component:** `src/components/screenTwo/BLESection.tsx` (entire file, ~150 lines)
2. **BLE Operations Hook:** `src/hooks/useBLEOperations.ts` (entire file, ~200 lines)
3. **Redux Slice:** `src/redux/slices/BTPeripheralSlice.ts` (entire file)
4. **Screen Two:** `src/screens/ScreenTwo.tsx` (check BLE section usage)

### Code to Reference

**useBLEOperations.ts** - Lines 1-200 (entire file)
```typescript
import { useBLEOperations } from '../hooks/useBLEOperations';

const {
  devices,
  isScanning,
  isConnected,
  startScan,
  stopScan,
  connectToDevice,
  disconnectDevice,
} = useBLEOperations();
```

**BLESection.tsx** - Lines 1-150 (entire file)
- UI component for BLE functionality
- Shows device list
- Handles scan/connect/disconnect buttons

### How to Use
1. Enable in `AppConfig.ts`: Set `bluetooth.enabled = true`
2. Enable features: Set `features.scanning = true`, etc.
3. Import hook: `import { useBLEOperations } from '../hooks/useBLEOperations';`
4. Use in component: Reference `BLESection.tsx` for complete implementation
5. Copy `BLESection.tsx` component (150 lines) to your screen

---

## WiFi Management

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 189-201

```typescript
wifi: {
    enabled: true,
    autoScan: false,
    scanInterval: 10,
    requestPermissions: true,
    features: {
        scanning: true,
        connecting: true,
        disconnecting: true,
        stateMonitoring: true,
        networkInfo: true,
    },
},
```

### Implementation Files
1. **WiFi Section Component:** `src/components/screenTwo/WiFiSection.tsx` (entire file, ~200 lines)
2. **WiFi Operations Hook:** `src/hooks/useWiFiOperations.ts` (entire file, ~107 lines)
3. **WiFi Manager:** `src/utils/WiFiManager.ts` (entire file, ~300 lines)
4. **WiFi Monitoring Hook:** `src/hooks/useWiFiMonitoring.ts` (entire file, ~33 lines)
5. **Redux Slice:** `src/redux/slices/WiFiSlice.ts` (entire file)
6. **Password Modal:** `src/components/screenTwo/WiFiPasswordModal.tsx` (entire file)

### Code to Reference

**useWiFiOperations.ts** - Lines 1-107 (entire file)
```typescript
import { useWiFiOperations } from '../hooks/useWiFiOperations';

const {
  networks,
  isScanning,
  isConnected,
  currentNetwork,
  scanForNetworks,
  connectToNetwork,
  disconnectFromNetwork,
} = useWiFiOperations();
```

**WiFiSection.tsx** - Lines 1-200 (entire file)
- Complete WiFi UI implementation
- Network list display
- Connect/disconnect functionality

### How to Use
1. Enable in `AppConfig.ts`: Set `wifi.enabled = true`
2. Enable features: Set `features.scanning = true`, etc.
3. Import hook: `import { useWiFiOperations } from '../hooks/useWiFiOperations';`
4. Copy `WiFiSection.tsx` component (200 lines) to your screen
5. Copy `WiFiPasswordModal.tsx` for password input

---

## Splash Screen

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 204-208

```typescript
splashScreen: {
    enabled: true,
    autoHide: true,
    minimumDisplayTime: 0,
},
```

### Implementation Files
1. **App.tsx:** `App.tsx` (lines 39-56)

### Code to Reference

**App.tsx** - Lines 39-56
```typescript
useEffect(() => {
  if (isInitialized && FeatureFlags.splashScreen?.enabled && FeatureFlags.splashScreen?.autoHide) {
    const hideSplash = () => {
      try {
        SplashScreen.hide();
      } catch (error) {
        console.warn('Failed to hide splash screen:', error);
      }
    };

    const minimumDisplayTime = FeatureFlags.splashScreen?.minimumDisplayTime || 0;
    if (minimumDisplayTime > 0) {
      setTimeout(hideSplash, minimumDisplayTime);
    } else {
      hideSplash();
    }
  }
}, [isInitialized]);
```

### How to Use
1. Enable in `AppConfig.ts`: Set `splashScreen.enabled = true`
2. Configure: Set `autoHide = true` and `minimumDisplayTime` (milliseconds)
3. Code already implemented in `App.tsx` - no additional code needed

---

## Maps & Location

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 211-221

```typescript
maps: {
    enabled: true,
    requestPermissions: true,
    showDashboardIcon: true,
    trackLocation: true,
    updateInterval: 1000,
    showCurrentLocation: true,
    followUserLocation: true,
    showLocationInfo: true,
    useOpenStreetMap: true,
},
```

### Implementation Files
1. **Maps Screen:** `src/screens/MapsScreen.tsx` (entire file, ~200 lines)
2. **Location Hook:** `src/hooks/useLocation.ts` (entire file, ~253 lines)
3. **Dashboard Hook:** `src/hooks/useDashboardScreen.ts` (lines 87-96)

### Code to Reference

**useLocation.ts** - Lines 1-253 (entire file)
```typescript
import { useLocation } from '../hooks/useLocation';

const {
  location,
  hasPermission,
  isTracking,
  error,
  startTracking,
  stopTracking,
  requestLocationPermission,
} = useLocation();
```

**MapsScreen.tsx** - Lines 1-200 (entire file)
- Complete maps implementation
- Map display with markers
- Location tracking UI

### How to Use
1. Enable in `AppConfig.ts`: Set `maps.enabled = true`
2. Configure tracking: Set `trackLocation = true`, `updateInterval = 1000`
3. Import hook: `import { useLocation } from '../hooks/useLocation';`
4. Copy `MapsScreen.tsx` (200 lines) for complete implementation
5. Add to navigation: Already done in `MainStackNavigator.tsx`

---

## Media Viewer

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 224-243

```typescript
mediaViewer: {
    enabled: true,
    showDashboardIcon: true,
    videoPlayer: {
        enabled: true,
        autoplay: false,
        controls: true,
        loop: false,
    },
    imageViewer: {
        enabled: true,
        zoomEnabled: true,
        allowGallerySelection: true,
    },
    documentViewer: {
        enabled: true,
        supportedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        allowFileSelection: true,
    },
},
```

### Implementation Files
1. **Media Viewer Hook:** `src/hooks/useMediaViewer.ts` (entire file, ~188 lines)
2. **Media Viewer Screen:** `src/screens/MediaViewerScreen.tsx` (entire file, ~150 lines)
3. **Media Viewer Screen Hook:** `src/hooks/useMediaViewerScreen.ts` (entire file)
4. **Media Display Component:** `src/components/mediaViewer/MediaDisplay.tsx` (entire file)
5. **Media Viewer Components:** `src/components/mediaViewer/MediaViewerComponents.tsx` (entire file)
6. **Dashboard Hook:** `src/hooks/useDashboardScreen.ts` (lines 98-107)

### Code to Reference

**useMediaViewer.ts** - Lines 1-188 (entire file)
```typescript
import { useMediaViewer } from '../hooks/useMediaViewer';

const {
  selectedMedia,
  isLoading,
  selectImageFromGallery,
  selectVideoFromGallery,
  selectDocument,
  clearMedia,
} = useMediaViewer();
```

**MediaViewerScreen.tsx** - Lines 1-150 (entire file)
- Complete media viewer implementation
- Handles images, videos, and documents

### How to Use
1. Enable in `AppConfig.ts`: Set `mediaViewer.enabled = true`
2. Enable sub-features: Set `videoPlayer.enabled = true`, etc.
3. Import hook: `import { useMediaViewer } from '../hooks/useMediaViewer';`
4. Copy `MediaViewerScreen.tsx` (150 lines) for complete implementation
5. Reference `MediaDisplay.tsx` and `MediaViewerComponents.tsx` for UI components

---

## Accessibility

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 246-255

```typescript
accessibility: {
    enabled: true,
    showDashboardIcon: true,
    screenReaderSupport: true,
    largeTextSupport: true,
    minimumTouchTargetSize: 48,
    highContrastMode: true,
    fontScaling: true,
    voiceControl: true,
},
```

### Implementation Files
1. **Accessibility Screen:** `src/screens/AccessibilityScreen.tsx` (entire file, ~200 lines)
2. **Accessibility Hook:** `src/hooks/useAccessibilityScreen.ts` (entire file, ~150 lines)
3. **Accessibility Components:** `src/components/accessibility/AccessibilityComponents.tsx` (entire file)
4. **Dashboard Hook:** `src/hooks/useDashboardScreen.ts` (lines 109-118)

### Code to Reference

**useAccessibilityScreen.ts** - Lines 1-150 (entire file)
```typescript
import { useAccessibilityScreen } from '../hooks/useAccessibilityScreen';

const {
  screenReaderEnabled,
  reduceMotionEnabled,
  fontScale,
  highContrastEnabled,
  colorBlindMode,
  touchTargetSize,
  // ... methods
} = useAccessibilityScreen();
```

**AccessibilityScreen.tsx** - Lines 1-200 (entire file)
- Complete accessibility settings UI
- All accessibility features implementation

### How to Use
1. Enable in `AppConfig.ts`: Set `accessibility.enabled = true`
2. Configure features: Set individual feature flags
3. Import hook: `import { useAccessibilityScreen } from '../hooks/useAccessibilityScreen';`
4. Copy `AccessibilityScreen.tsx` (200 lines) for complete implementation
5. Reference `AccessibilityComponents.tsx` for UI components

---

## Notifications

### Configuration Location
**File:** `src/config/AppConfig.ts`  
**Lines:** 258-267

```typescript
notifications: {
    enabled: true,
    requestPermissions: true,
    features: {
        sending: true,
        scheduling: true,
        canceling: true,
        permissionChecking: true,
    },
},
```

### Implementation Files
1. **Notifications Hook:** `src/hooks/useNotifications.ts` (entire file, ~138 lines)
2. **Notification Service:** `src/services/NotificationService.ts` (entire file, ~200 lines)
3. **Settings Hook:** `src/hooks/useSettingsScreen.ts` (line 39, 118)
4. **Settings Cards:** `src/components/settings/SettingsCards.tsx` (line 118)

### Code to Reference

**useNotifications.ts** - Lines 1-138 (entire file)
```typescript
import { useNotifications } from '../hooks/useNotifications';

const {
  hasPermission,
  isLoading,
  sendTestNotification,
  requestPermission,
} = useNotifications();
```

**NotificationService.ts** - Lines 1-200 (entire file)
- Core notification service
- Methods: `sendNotification()`, `scheduleNotification()`, `cancelNotification()`

### How to Use
1. Enable in `AppConfig.ts`: Set `notifications.enabled = true`
2. Enable features: Set `features.sending = true`, etc.
3. Import hook: `import { useNotifications } from '../hooks/useNotifications';`
4. Use: `const { sendTestNotification } = useNotifications(); await sendTestNotification();`
5. Reference `NotificationService.ts` for advanced usage

---

## Quick Reference: File Locations Summary

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

---

## General Implementation Pattern

For most features, follow this pattern:

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

---

## Best Practices

1. **Always check `enabled` flag first** before using any feature
2. **Use optional chaining** (`?.`) when accessing nested flags
3. **Provide fallback values** using nullish coalescing (`??`)
4. **Test after enabling** - restart app and verify functionality
5. **Check dependencies** - some features require native modules or permissions
6. **Review console logs** - many features log debug information in development mode

---

## Common Issues & Solutions

### Feature not showing up
- Check if `enabled: true` in `AppConfig.ts`
- Verify feature is added to navigation (if screen-based)
- Check dashboard menu logic in `useDashboardScreen.ts`
- Restart app after changing flags

### Feature not working
- Check if required permissions are granted
- Verify native modules are properly linked
- Check console for error messages
- Review hook implementation for feature flag checks

### Language not changing
- Verify `localization.enabled = true`
- Check translation files exist (`en.json`, `es.json`)
- Clear app data to reset saved language preference
- Check console logs for detection messages

---

## Need Help?

Refer to:
- `FEATURE_FLAGS.md` - Detailed flag reference
- `DOCUMENTATION.md` - General app documentation
- Individual hook files for implementation details
- Component files for UI examples

