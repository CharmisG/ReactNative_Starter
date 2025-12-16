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
    },

    // Media pickers on settings screen
    mediaPicker: {
        camera: true,
        gallery: true,
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
