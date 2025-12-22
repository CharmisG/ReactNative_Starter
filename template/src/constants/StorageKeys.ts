/**
 * Storage Keys Constants
 * 
 * Centralized keys for AsyncStorage to avoid typos and ensure consistency.
 * All keys will be prefixed with the keyPrefix from FeatureFlags.localStorage
 */

export const StorageKeys = {
  // User preferences
  SELECTED_LANGUAGE: 'selected_language',

  // App state
  APP_INITIALIZED: 'app_initialized',
  APP_INSTALLED_DATE: 'app_installed_date',

  // Version checking
  LAST_VERSION_CHECK: 'last_version_check',

  // User account
  ACCOUNT_CREATED: 'account_created',
  LAST_LOGIN: 'last_login',

  // App statistics
  APP_STATISTICS: 'app_statistics',

  // Biometric authentication
  BIOMETRIC_EMAIL: 'biometric_email',
  BIOMETRIC_PASSWORD: 'biometric_password',
  BIOMETRIC_ENABLED: 'biometric_enabled',

  // Future keys can be added here:
  // USER_PREFERENCES: 'user_preferences',
  // LAST_SYNC_TIME: 'last_sync_time',
  // CACHED_DATA: 'cached_data',
} as const;

