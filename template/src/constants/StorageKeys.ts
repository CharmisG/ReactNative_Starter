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
  
  // Future keys can be added here:
  // USER_PREFERENCES: 'user_preferences',
  // LAST_SYNC_TIME: 'last_sync_time',
  // CACHED_DATA: 'cached_data',
} as const;

