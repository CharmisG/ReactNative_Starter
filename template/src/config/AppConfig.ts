/**
 * Application Configuration
 * 
 * Central configuration file for the entire React Native starter kit.
 * Update these values to customize app behavior without modifying code.
 */

// ========================================
// API & URL CONFIGURATION
// ========================================
export const UrlConstants = {
    // Base API URL - Update this to your backend
    baseUrl: 'https://jsonplaceholder.typicode.com/',

    // API endpoints
    sampleEndpoint: 'todos',
    versionEndpoint: 'api/version',
};

// ========================================
// APP INFO & VERSION CONFIGURATION
// ========================================
export const AppConfig = {
    // App name
    name: 'React Native Starter Kit',

    // Current app version - MUST match package.json
    version: '1.0.0',

    // Minimum supported version
    minimumVersion: '1.0.0',

    // Build number (increment for each build)
    buildNumber: 1,
};

// ========================================
// STORE CONFIGURATION (App Store & Play Store)
// ========================================
export const StoreConfig = {
    // iOS App Store
    ios: {
        appId: '123456789',
        appName: 'MyApp',
        storeUrl: 'https://apps.apple.com/app/myapp/id123456789',
        bundleId: 'com.mycompany.myapp',
    },

    // Android Play Store
    android: {
        packageName: 'com.saviant.reactstarterkit',
        storeUrl: 'https://play.google.com/store/apps/details?id=com.saviant.reactstarterkit',
    },
};

// ========================================
// AUTHENTICATION CONFIGURATION
// ========================================
export const AuthConfig = {
    // Enable/disable social login providers
    providers: {
        google: {
            webClientId: '171302444102-29k2kf2chce0ht98up4qql739f4a1o0j.apps.googleusercontent.com',
            iosClientId: '171302444102-he4152a4cmkbi0u8gpurhign54t0gvn0.apps.googleusercontent.com',
            offlineAccess: false,
            profileImageSize: 150,
        },
    },
    // Session timeout (minutes)
    sessionTimeout: 30,
    // Auto-login if token available
    autoLogin: true,
};

// ========================================
// FEATURE FLAGS
// ========================================
export const FeatureFlags = {
    // Version checking
    versionChecking: {
        enabled: true,
        checkOnStartup: true,
        checkInterval: 24 * 60 * 60 * 1000, // 24 hours
        showDialogAutomatically: true,
    },

    // Error handling layer
    errorHandling: {
        enabled: true,           // master toggle for centralized error handling/logging
        logToFile: false,        // log errors to file (requires file logger enabled)
        logToExternal: false,    // send HIGH/CRITICAL errors to external service
        captureConsole: true,    // capture console errors
    },

    // Offline mode
    offlineMode: {
        enabled: true,
        cacheTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
    },

    // Local storage (AsyncStorage-based)
    localStorage: {
        enabled: true,              // master toggle for local storage helper
        keyPrefix: 'app_',          // optional prefix for stored keys
        crashOnDisabled: false,     // if true, throw when used while disabled
    },

    // Authentication providers
    authProviders: {
        google: true,
        facebook: true,
        apple: true,
        biometric: true,        // Enable biometric authentication (Face ID, Touch ID, Fingerprint)
    },

    // Biometric authentication
    biometric: {
        enabled: true,              // master toggle for biometric authentication
        allowDeviceCredentials: true, // Allow device PIN/pattern as fallback
        promptMessage: 'Authenticate to login', // Custom prompt message
        cancelButtonText: 'Cancel',  // Cancel button text
        showPrompt: true,            // Show system biometric prompt
        saveCredentials: true,       // Save credentials for biometric login
    },

    // Media pickers on settings screen
    mediaPicker: {
        camera: true,
        gallery: true,
    },

    // Settings screen features
    settingsScreen: {
        showCurrencyExample: false,  // Show currency formatting example card
        showDateTimeExample: false,  // Show date/time formatting example card
        showUnitsExample: false,     // Show units & measurements example card
        showSocialShare: true,       // Show social sharing button
        dateTimeExample: {
            showCurrentDateTime: true,    // Show current date & time section
            showDateFormats: true,        // Show date formats section (short, medium, long, full)
            showTimeFormats: true,        // Show time formats section (12-hour, 24-hour)
            showRelativeTime: true,      // Show relative time examples
            showAppInstalledRelative: true, // Show app installed relative time
        },
        showLastVersionCheck: true,  // Show last version check timestamp
    },

    // Social sharing
    socialShare: {
        enabled: true,              // master toggle for social sharing
        shareAppName: true,         // Include app name in share message
        shareAppStoreLinks: true,   // Include app store links in share
        shareMessage: 'Check out this amazing app!', // Default share message
        shareTitle: 'Share App',   // Share dialog title
        platforms: {
            whatsapp: true,         // Enable WhatsApp sharing
            facebook: true,         // Enable Facebook sharing
            twitter: true,          // Enable Twitter/X sharing
            email: true,            // Enable Email sharing
            sms: true,              // Enable SMS sharing
            clipboard: true,        // Enable copy to clipboard
        },
    },

    // Localization / i18n
    localization: {
        enabled: false,              // master toggle for i18n
        defaultLanguage: 'en',      // fallback language code
        supportedLanguages: ['en', 'es'], // list of supported language codes
        autoDetectDevice: true,     // try device locale on startup when supported
    },
};

// ========================================
// DEBUG & LOGGING CONFIGURATION
// ========================================
export const DebugConfig = {
    // Enable console logging
    logging: __DEV__,

    // Log API calls
    logApiCalls: __DEV__,

    // Log Redux actions
    logReduxActions: __DEV__,

    // Log navigation
    logNavigation: __DEV__,

    // Mock API responses (for testing)
    mockApi: {
        enabled: false,
        delay: 500, // milliseconds
    },

    // Simulate version update (for testing)
    mockVersionUpdate: {
        enabled: false,
        latestVersion: '2.0.0',
        forceUpdate: false,
    },
};

// ========================================
// Firebase CONFIGURATION
// ========================================
export const FirebaseConfig = {
    // Crashlytics
    crashlytics: {
        enabled: true,
        collectDeviceInfo: true,
        collectSessionId: true,
    },

    // Analytics
    analytics: {
        enabled: true,
        analyticsCollectionEnabled: true,
    },

    // Remote Config
    remoteConfig: {
        enabled: false,
        cacheExpiration: 3600, // seconds
    },
};

// ========================================
// PERMISSIONS CONFIGURATION
// ========================================
export const PermissionsConfig = {
    // Permissions to request on app startup
    requiredPermissions: [] as string[],

    // Optional permissions
    optionalPermissions: [] as string[],
};

// ========================================
// EXPORT ALL CONFIGURATIONS
// ========================================
export const AllConfigs = {
    url: UrlConstants,
    app: AppConfig,
    store: StoreConfig,
    auth: AuthConfig,
    features: FeatureFlags,
    debug: DebugConfig,
    firebase: FirebaseConfig,
    permissions: PermissionsConfig,
};

export default AllConfigs;
