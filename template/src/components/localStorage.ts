import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeatureFlags } from '../config/AppConfig';

const config = FeatureFlags.localStorage;

const isEnabled = () => config?.enabled !== false;

const prefixedKey = (key: string) => `${config?.keyPrefix ?? ''}${key}`;

const guardEnabled = () => {
  if (isEnabled()) {
    return true;
  }
  if (config?.crashOnDisabled) {
    throw new Error('Local storage feature is disabled');
  }
  return false;
};

export async function setItem(key: string, value: string): Promise<void> {
  if (!guardEnabled()) {
    return;
  }
  await AsyncStorage.setItem(prefixedKey(key), value);
}

export async function getItem(key: string): Promise<string | null> {
  if (!guardEnabled()) {
    return null;
  }
  return AsyncStorage.getItem(prefixedKey(key));
}

export async function removeItem(key: string): Promise<void> {
  if (!guardEnabled()) {
    return;
  }
  await AsyncStorage.removeItem(prefixedKey(key));
}

// Store JSON-serializable data
export async function setJson(key: string, value: unknown): Promise<void> {
  if (!guardEnabled()) {
    return;
  }
  await AsyncStorage.setItem(prefixedKey(key), JSON.stringify(value));
}

// Retrieve JSON-serializable data
export async function getJson<T>(key: string): Promise<T | null> {
  if (!guardEnabled()) {
    return null;
  }
  const raw = await AsyncStorage.getItem(prefixedKey(key));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    if (__DEV__) {
      console.warn('Failed to parse stored JSON', e);
    }
    return null;
  }
}

// Backward compatibility aliases (if already imported elsewhere)
export { setJson as setJSON, getJson as getJSON };

