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
        enabled: true,              // master toggle for i18n
        defaultLanguage: 'en',      // fallback language code
        supportedLanguages: ['en', 'es'], // list of supported language codes
        autoDetectDevice: true,     // try device locale on startup when supported
    },

    // Bluetooth Low Energy (BLE)
    bluetooth: {
        enabled: true,              // master toggle for BLE functionality
        autoStart: true,            // automatically start BLE manager on screen mount
        showAlert: false,           // show native alert when starting BLE manager
        scanDuration: 5,            // default scan duration in seconds
        requestPermissions: true,   // automatically request Bluetooth permissions
        features: {
            scanning: true,         // Enable BLE scanning
            connecting: true,       // Enable connecting to peripherals
            disconnecting: true,    // Enable disconnecting from peripherals
            stateMonitoring: true,  // Monitor Bluetooth state changes
        },
    },

    // WiFi functionality
    wifi: {
        enabled: true,              // master toggle for WiFi functionality
        autoScan: false,            // automatically scan for networks on screen mount
        scanInterval: 10,           // scan interval in seconds (if autoScan is enabled)
        requestPermissions: true,   // automatically request location permissions (required for WiFi scanning on Android)
        features: {
            scanning: true,         // Enable WiFi network scanning
            connecting: true,       // Enable connecting to WiFi networks
            disconnecting: true,    // Enable disconnecting from WiFi networks
            stateMonitoring: true,  // Monitor WiFi connection state
            networkInfo: true,      // Show current network information
        },
    },

    // Splash Screen
    splashScreen: {
        enabled: true,              // master toggle for splash screen functionality
        autoHide: true,             // automatically hide splash screen when app is initialized
        minimumDisplayTime: 0,      // minimum time to display splash screen in milliseconds (0 = no minimum)
    },

    // Maps & Location
    maps: {
        enabled: true,              // master toggle for maps functionality
        requestPermissions: true,   // automatically request location permissions
        showDashboardIcon: true,    // show Maps option in dashboard navigation menu
        trackLocation: true,         // enable real-time location tracking
        updateInterval: 1000,       // location update interval in milliseconds (1000 = 1 second)
        showCurrentLocation: true,   // show current location marker on map
        followUserLocation: true,    // automatically center map on user location
        showLocationInfo: true,      // display latitude and longitude information
        useOpenStreetMap: true,     // use OpenStreetMap instead of Google Maps (Android: OpenStreetMap, iOS: Apple Maps)
    },

    // Media Viewer
    mediaViewer: {
        enabled: true,              // master toggle for media viewer functionality
        showDashboardIcon: true,    // show Media Viewer option in dashboard navigation menu
        videoPlayer: {
            enabled: true,          // enable video player
            autoplay: false,       // autoplay videos
            controls: true,         // show video controls
            loop: false,            // loop videos
        },
        imageViewer: {
            enabled: true,          // enable image viewer
            zoomEnabled: true,      // enable pinch to zoom
            allowGallerySelection: true, // allow selecting images from gallery
        },
        documentViewer: {
            enabled: true,          // enable document/PDF viewer
            supportedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'], // supported file formats
            allowFileSelection: true, // allow selecting files from device
        },
    },

    // Accessibility features
    accessibility: {
        enabled: true,              // master toggle for accessibility functionality
        showDashboardIcon: true,    // show Accessibility option in dashboard navigation menu
        screenReaderSupport: true,  // enable screen reader specific enhancements
        largeTextSupport: true,     // enable large text enhancements
        minimumTouchTargetSize: 48, // minimum touch target size in dp
        highContrastMode: true,    // enable high contrast mode
        fontScaling: true,          // enable font scaling
        voiceControl: true,         // enable voice control features
    },

    // Notifications
    notifications: {
        enabled: true,              // master toggle for notification functionality
        requestPermissions: true,   // automatically request notification permissions
        features: {
            sending: true,          // Enable sending notifications
            scheduling: true,        // Enable scheduling notifications
            canceling: true,         // Enable canceling notifications
            permissionChecking: true, // Enable permission checking
        },
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
