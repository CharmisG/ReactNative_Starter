# React Native Starter Kit - Configurable Architecture Guide

## Overview

This starter kit is now **fully configurable** without modifying core code. All settings are centralized in `src/config/AppConfig.ts`.

---

## 📁 Configuration Structure

### Single Source of Truth: `src/config/AppConfig.ts`

```
AppConfig.ts
├── ApiConfig          (API & Backend)
├── AppConfig          (App Info & Version)
├── StoreConfig        (App Store & Play Store)
├── AuthConfig         (Authentication)
├── UIConfig           (UI & Theme)
├── LocalizationConfig (Languages)
├── FeatureFlags       (Feature Toggles)
├── DebugConfig        (Debug & Testing)
├── FirebaseConfig     (Firebase)
├── NetworkConfig      (Networking)
└── PermissionsConfig  (Permissions)
```

---

## 🔧 Configuration Sections

### 1. ApiConfig - Backend API Settings

```typescript
ApiConfig = {
  baseUrl: 'https://your-api.com',  // Your backend URL
  timeout: 10000,                    // Request timeout in ms
  headers: { ... },                  // Default headers
  endpoints: {
    version: '/api/version',
    users: '/api/users',
    sampleData: '/api/sample',
  }
}
```

**Usage:**
```typescript
import { ApiConfig } from 'src/config/AppConfig';

const url = `${ApiConfig.baseUrl}${ApiConfig.endpoints.version}`;
// Result: https://your-api.com/api/version
```

---

### 2. AppConfig - App Metadata

```typescript
AppConfig = {
  name: 'React Native Starter Kit',
  version: '1.0.0',              // MUST match package.json
  minimumVersion: '1.0.0',       // Minimum supported version
  buildNumber: 1,                // Increment per build
}
```

**Usage:**
```typescript
import { AppConfig } from 'src/config/AppConfig';

console.log(`App: ${AppConfig.name} v${AppConfig.version}`);
```

---

### 3. StoreConfig - App Store URLs

```typescript
StoreConfig = {
  ios: {
    appId: '123456789',
    appName: 'MyApp',
    storeUrl: 'https://apps.apple.com/app/myapp/id123456789',
    bundleId: 'com.mycompany.myapp',
  },
  android: {
    packageName: 'com.saviant.reactstarterkit',
    storeUrl: 'https://play.google.com/store/apps/details?id=...',
  }
}
```

**How to get URLs:**
- **iOS:** App Store → Your App → Share → Copy Link
- **Android:** Play Store → Your App → Share → Copy Link

---

### 4. AuthConfig - Authentication Providers

```typescript
AuthConfig = {
  providers: {
    google: {
      enabled: true,
      webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
      iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    },
    facebook: {
      enabled: true,
      appId: 'YOUR_FACEBOOK_APP_ID',
    },
    apple: {
      enabled: true,
      teamId: 'YOUR_APPLE_TEAM_ID',
    },
  },
  sessionTimeout: 30,  // Minutes
  autoLogin: true,
}
```

**Enable/Disable Providers:**
```typescript
// Disable Facebook login:
AuthConfig.providers.facebook.enabled = false;
```

---

### 5. UIConfig - User Interface Settings

```typescript
UIConfig = {
  defaultTheme: 'light',      // 'light' or 'dark'
  allowThemeSwitch: true,     // User can change theme
  enableAnimations: true,     // Enable UI animations
  
  toast: {
    duration: 3000,           // Toast display time (ms)
    position: 'bottom',       // Toast position
  },
  
  dialog: {
    animationType: 'fade',    // 'fade', 'slide', 'none'
    backdropColor: 'rgba(0, 0, 0, 0.5)',
  }
}
```

**Usage Example:**
```typescript
// Change default theme
UIConfig.defaultTheme = 'dark';

// Disable animations
UIConfig.enableAnimations = false;

// Change toast duration
UIConfig.toast.duration = 5000;
```

---

### 6. LocalizationConfig - Multi-Language Support

```typescript
LocalizationConfig = {
  supportedLanguages: {
    en: { name: 'English', nativeName: 'English' },
    es: { name: 'Spanish', nativeName: 'Español' },
  },
  defaultLanguage: 'en',
  autoDetect: true,  // Auto-detect device language
}
```

**Add New Language:**
```typescript
supportedLanguages: {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  fr: { name: 'French', nativeName: 'Français' },  // NEW
}
```

---

### 7. FeatureFlags - Enable/Disable Features

```typescript
FeatureFlags = {
  versionChecking: {
    enabled: true,
    checkOnStartup: true,
    checkInterval: 24 * 60 * 60 * 1000,  // 24 hours
    showDialogAutomatically: true,
  },
  
  analytics: {
    enabled: true,
    trackScreenViews: true,
    trackErrors: true,
  },
  
  pullToRefresh: {
    enabled: true,
  },
  
  offlineMode: {
    enabled: true,
    cacheTimeout: 7 * 24 * 60 * 60 * 1000,  // 7 days
  }
}
```

**Example - Disable Version Checking:**
```typescript
FeatureFlags.versionChecking.enabled = false;
```

---

### 8. DebugConfig - Development & Testing

```typescript
DebugConfig = {
  logging: __DEV__,           // Automatic: true in dev, false in prod
  logApiCalls: __DEV__,       // Log API requests
  logReduxActions: __DEV__,   // Log Redux actions
  logNavigation: __DEV__,     // Log navigation
  
  // Mock API responses for testing
  mockApi: {
    enabled: false,
    delay: 500,               // Simulated network delay
  },
  
  // Mock version update for testing UI
  mockVersionUpdate: {
    enabled: false,
    latestVersion: '2.0.0',
    forceUpdate: false,
  }
}
```

**Enable Mock Mode for Testing:**
```typescript
// Test version update dialog
DebugConfig.mockVersionUpdate.enabled = true;
DebugConfig.mockVersionUpdate.forceUpdate = true;

// Test API responses
DebugConfig.mockApi.enabled = true;
DebugConfig.mockApi.delay = 1000;  // 1 second delay
```

---

### 9. FirebaseConfig - Firebase Services

```typescript
FirebaseConfig = {
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
    cacheExpiration: 3600,  // 1 hour
  }
}
```

---

### 10. NetworkConfig - Networking Settings

```typescript
NetworkConfig = {
  requestTimeout: 10000,        // 10 seconds
  retryFailedRequests: true,   // Retry on failure
  maxRetries: 3,               // Max attempts
  retryDelay: 1000,            // 1 second between retries
  cacheEnabled: true,          // Cache responses
  cacheDuration: 5 * 60 * 1000, // 5 minutes
}
```

---

## 🚀 Quick Start - Setup Guide

### Step 1: Update App Info
```typescript
// src/config/AppConfig.ts
AppConfig = {
  name: 'My Awesome App',
  version: '1.0.0',           // Match package.json
  buildNumber: 1,
}
```

### Step 2: Configure Backend API
```typescript
ApiConfig = {
  baseUrl: 'https://api.mycompany.com',  // Your backend URL
  timeout: 10000,
  endpoints: {
    version: '/v1/version',
    users: '/v1/users',
    // ... add your endpoints
  }
}
```

### Step 3: Setup Store URLs
```typescript
StoreConfig = {
  ios: {
    storeUrl: 'https://apps.apple.com/app/myapp/id987654321',
    bundleId: 'com.mycompany.myapp',
  },
  android: {
    packageName: 'com.mycompany.myapp',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.myapp',
  }
}
```

### Step 4: Configure Authentication
```typescript
AuthConfig = {
  providers: {
    google: {
      enabled: true,
      webClientId: 'YOUR_GOOGLE_CLIENT_ID',
      iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    },
    // ... other providers
  }
}
```

### Step 5: Disable Debug Mode for Production
```typescript
DebugConfig = {
  logging: false,              // Disable in production
  logApiCalls: false,
  mockVersionUpdate: { enabled: false },
  mockApi: { enabled: false },
}
```

---

## 📊 Common Configuration Scenarios

### Scenario 1: Disable Version Checking
```typescript
FeatureFlags.versionChecking.enabled = false;
```

### Scenario 2: Check Updates Every Hour
```typescript
FeatureFlags.versionChecking.checkInterval = 60 * 60 * 1000;
```

### Scenario 3: Custom API Endpoint
```typescript
ApiConfig.baseUrl = 'https://staging-api.mycompany.com';
```

### Scenario 4: Dark Theme by Default
```typescript
UIConfig.defaultTheme = 'dark';
```

### Scenario 5: Disable Social Login
```typescript
AuthConfig.providers.google.enabled = false;
AuthConfig.providers.facebook.enabled = false;
AuthConfig.providers.apple.enabled = false;
```

### Scenario 6: Enable Testing Mode
```typescript
DebugConfig.mockVersionUpdate.enabled = true;
DebugConfig.mockApi.enabled = true;
DebugConfig.logging = true;
```

---

## 🔗 How Components Use Configuration

### VersionService
```typescript
import { ApiConfig, AppConfig, StoreConfig, DebugConfig } from 'src/config/AppConfig';

// Gets configuration on startup
this.currentVersion = AppConfig.version;
const url = `${ApiConfig.baseUrl}${ApiConfig.endpoints.version}`;
```

### Update Dialog
```typescript
// Uses StoreConfig to open stores
const url = Platform.OS === 'ios' 
  ? StoreConfig.ios.storeUrl 
  : StoreConfig.android.storeUrl;
```

### Authentication
```typescript
// Uses AuthConfig for provider setup
if (AuthConfig.providers.google.enabled) {
  // Initialize Google Sign-In
}
```

---

## 📝 Environment-Specific Configuration

For different environments (dev, staging, production):

```typescript
// Create separate config files:
// src/config/AppConfig.dev.ts
// src/config/AppConfig.staging.ts
// src/config/AppConfig.prod.ts

// In your build, use the appropriate config:
import AppConfig from __DEV__ 
  ? './AppConfig.dev' 
  : './AppConfig.prod';
```

---

## ✅ Production Checklist

Before releasing to production:

- [ ] Update `AppConfig.version` to match package.json
- [ ] Set real API endpoint in `ApiConfig.baseUrl`
- [ ] Set real store URLs in `StoreConfig`
- [ ] Enable all required auth providers in `AuthConfig`
- [ ] Disable debug mode: `DebugConfig.logging = false`
- [ ] Disable mock features: `DebugConfig.mockApi.enabled = false`
- [ ] Set `DebugConfig.mockVersionUpdate.enabled = false`
- [ ] Enable required feature flags in `FeatureFlags`
- [ ] Configure Firebase settings in `FirebaseConfig`

---

## 🎯 Summary

The entire starter kit is now configurable through a single file: `src/config/AppConfig.ts`

**No code changes needed—just configuration!**

- Change API endpoints → Update `ApiConfig`
- Enable/disable features → Update `FeatureFlags`
- Switch themes → Update `UIConfig`
- Test functionality → Use `DebugConfig`
- Customize UI → Update relevant config sections

All changes are applied instantly without modifying any component code.

