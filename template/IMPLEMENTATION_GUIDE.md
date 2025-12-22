# Date & Time Implementation Guide

This guide shows you **where and how** to implement date/time formatting in your React Native app using the `DateFormatter` utility.

## 📍 Recommended Implementation Locations

### 1. **DashboardScreen** - List Item Timestamps

**Location:** `src/screens/DashboardScreen.tsx`

Add timestamps to show when items were created or last updated.

```typescript
// In the Item component, add a timestamp
import DateFormatter from '../utils/DateFormatter';

const Item = ({ appTheme, title, completed, id }: ItemProps) => {
  // Simulate a creation date (in real app, this would come from your API)
  const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  
  return (
    <View style={[styles.item, { backgroundColor: appTheme === AppConstants.dark ? Colors.black : Colors.white }]}>
      <Text style={styles.itemTextColor}>{id}</Text>
      <Text style={styles.itemTextColor}>{title}</Text>
      <Text style={styles.itemTextColor}>{completed?.toString()}</Text>
      {/* Add this line */}
      <Text style={[styles.itemTextColor, styles.timestamp]}>
        {DateFormatter.formatRelative(createdAt, 'short')}
      </Text>
    </View>
  );
};
```

**Add to styles:**
```typescript
timestamp: {
  fontSize: fontHeight.FONT12,
  color: Colors.grey,
  marginTop: 4,
  fontStyle: 'italic',
},
```

---

### 2. **SettingsScreen** - Version Check Timestamp

**Location:** `src/screens/SettingsScreen.tsx`

Show when the app last checked for updates.

```typescript
import DateFormatter from '../utils/DateFormatter';
import { getItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';

const SettingsScreen = ({ navigation }: Props) => {
  const [lastVersionCheck, setLastVersionCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Load last check time
    const loadLastCheck = async () => {
      try {
        const timestamp = await getItem(StorageKeys.LAST_VERSION_CHECK);
        if (timestamp) {
          setLastVersionCheck(new Date(timestamp));
        }
      } catch (error) {
        console.warn('Failed to load last version check', error);
      }
    };
    loadLastCheck();
  }, []);

  const onCheckAppVersion = async () => {
    try {
      showToast({ text: 'Checking for app updates...', type: 'info' });
      await dispatch(VersionSliceActions.checkVersionUpdate());
      // Save current time
      const now = new Date();
      setLastVersionCheck(now);
      await setItem(StorageKeys.LAST_VERSION_CHECK, now.toISOString());
    } catch (error) {
      console.error('Version check failed', error);
      showToast({ text: 'Failed to check for updates', type: 'error' });
    }
  };

  // Add this in your JSX, near the "Check for Updates" button
  return (
    // ... existing code ...
    <Pressable
      style={({ pressed }) => [styles.commonStyles, styles.crashButton, pressed && styles.buttonPressedEffect]}
      onPress={onCheckAppVersion}
    >
      <Text style={styles.buttonText}>{Translate('Check for Updates')}</Text>
    </Pressable>
    {/* Add this */}
    {lastVersionCheck && (
      <Text style={styles.lastCheckText}>
        {Translate('Last checked')}: {DateFormatter.formatDateTime(lastVersionCheck, 'short', 'short')}
      </Text>
    )}
  );
};
```

**Add to StorageKeys.ts:**
```typescript
export const StorageKeys = {
  // ... existing keys
  LAST_VERSION_CHECK: 'last_version_check',
};
```

---

### 3. **ProfileScreen** - Account Information

**Location:** `src/screens/ProfileScreen.tsx`

Show account creation date and last login time.

```typescript
import DateFormatter from '../utils/DateFormatter';
import { getItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';

const ProfileScreen = ({ navigation }: Props) => {
  const [accountCreated, setAccountCreated] = useState<Date | null>(null);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);

  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        // Load account creation date (set on first login)
        const created = await getItem(StorageKeys.ACCOUNT_CREATED);
        if (created) {
          setAccountCreated(new Date(created));
        } else {
          // First time - set creation date
          const now = new Date();
          setAccountCreated(now);
          await setItem(StorageKeys.ACCOUNT_CREATED, now.toISOString());
        }

        // Load last login
        const login = await getItem(StorageKeys.LAST_LOGIN);
        if (login) {
          setLastLogin(new Date(login));
        }
        
        // Update last login to now
        const now = new Date();
        setLastLogin(now);
        await setItem(StorageKeys.LAST_LOGIN, now.toISOString());
      } catch (error) {
        console.warn('Failed to load account info', error);
      }
    };
    loadAccountInfo();
  }, []);

  return (
    <MainView screenTitle={Translate("Profile Screen")} leftIconVisible={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
        <Text>{Translate('This is the Profile Screen')}</Text>
        
        {/* Add account info */}
        {accountCreated && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: Colors.grey, marginTop: 10 }}>
              {Translate('Account created')}: {DateFormatter.formatDate(accountCreated, 'long')}
            </Text>
          </View>
        )}
        
        {lastLogin && (
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: Colors.grey }}>
              {Translate('Last login')}: {DateFormatter.formatRelative(lastLogin, 'short')}
            </Text>
          </View>
        )}
      </View>
    </MainView>
  );
};
```

**Add to StorageKeys.ts:**
```typescript
export const StorageKeys = {
  // ... existing keys
  ACCOUNT_CREATED: 'account_created',
  LAST_LOGIN: 'last_login',
};
```

---

### 4. **UpdateDialog** - Version Release Date

**Location:** `src/components/UpdateDialog.tsx`

Show when the new version was released.

```typescript
import DateFormatter from '../utils/DateFormatter';

// Update VersionInfo interface in VersionService.ts
export interface VersionInfo {
    currentVersion: string;
    latestVersion: string;
    isUpdateAvailable: boolean;
    isForceUpdate: boolean;
    updateMessage?: string;
    updateUrl?: string;
    releaseDate?: string; // Add this
}

// In UpdateDialog component
const UpdateDialog: React.FC<Props> = ({ visible, versionInfo, onDismiss }) => {
    // ... existing code ...

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
            <View style={styles.overlay}>
                <View style={styles.dialogContainer}>
                    {/* ... existing header ... */}

                    {/* Version Info */}
                    <View style={styles.versionInfo}>
                        <View style={styles.versionRow}>
                            <Text style={styles.label}>Current Version:</Text>
                            <Text style={styles.versionValue}>{versionInfo.currentVersion}</Text>
                        </View>
                        <View style={styles.versionRow}>
                            <Text style={styles.label}>Latest Version:</Text>
                            <Text style={[styles.versionValue, { color: Colors.primary }]}>
                                {versionInfo.latestVersion}
                            </Text>
                        </View>
                        {/* Add this */}
                        {versionInfo.releaseDate && (
                            <View style={styles.versionRow}>
                                <Text style={styles.label}>Released:</Text>
                                <Text style={styles.versionValue}>
                                    {DateFormatter.formatDate(versionInfo.releaseDate, 'medium')}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ... rest of component ... */}
                </View>
            </View>
        </Modal>
    );
};
```

---

### 5. **DashboardScreen** - Last Refresh Time

**Location:** `src/screens/DashboardScreen.tsx`

Show when the list was last refreshed.

```typescript
const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(HomeSliceActions.getSampleDataAction());
      setLastRefresh(new Date()); // Update refresh time
    } catch (err) {
      console.warn('Refresh failed', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      {/* ... existing code ... */}
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.itemTextColor}>{Translate('Sample List')}</Text>
        {isLoading && sampleData.length > 0 && <LoadingIndicator size="small" color={Colors.primary} inline imageSource={Images.home} />}
        {/* Add this */}
        {lastRefresh && (
          <Text style={[styles.itemTextColor, { fontSize: fontHeight.FONT12 }]}>
            {DateFormatter.formatTime(lastRefresh, 'short')}
          </Text>
        )}
      </View>
      {/* ... rest of component ... */}
    </View>
  );
};
```

---

### 6. **SettingsScreen** - App Installation Date

**Location:** `src/screens/SettingsScreen.tsx`

Show when the app was first installed.

```typescript
import DateFormatter from '../utils/DateFormatter';
import { getItem, setItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';

const SettingsScreen = ({ navigation }: Props) => {
  const [appInstalledDate, setAppInstalledDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadInstallDate = async () => {
      try {
        let installDate = await getItem(StorageKeys.APP_INSTALLED_DATE);
        if (!installDate) {
          // First time - set installation date
          const now = new Date();
          installDate = now.toISOString();
          await setItem(StorageKeys.APP_INSTALLED_DATE, installDate);
        }
        setAppInstalledDate(new Date(installDate));
      } catch (error) {
        console.warn('Failed to load install date', error);
      }
    };
    loadInstallDate();
  }, []);

  return (
    <MainView screenTitle={Translate('Settings')} leftIconPressed={() => navigation.goBack()}>
      <ScrollView>
        {/* ... existing settings ... */}

        {/* Add this new card */}
        {appInstalledDate && (
          <View style={[styles.card, { backgroundColor: appTheme === AppConstants.dark ? Colors.grey : Colors.white }]}>
            <Text style={styles.cardTitle}>{Translate('App Information')}</Text>
            <Text style={styles.cardSubtitle}>
              {Translate('Installed on')}: {DateFormatter.formatDate(appInstalledDate, 'long')}
            </Text>
            <Text style={styles.cardSubtitle}>
              {Translate('Version')}: {AppConfig.version}
            </Text>
          </View>
        )}
      </ScrollView>
    </MainView>
  );
};
```

**Add to StorageKeys.ts:**
```typescript
export const StorageKeys = {
  // ... existing keys
  APP_INSTALLED_DATE: 'app_installed_date',
};
```

---

### 7. **DashboardScreen** - Header with Current Date/Time

**Location:** `src/screens/DashboardScreen.tsx`

Show current date/time in the header.

```typescript
import { useState, useEffect } from 'react';
import DateFormatter from '../utils/DateFormatter';

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.topHalf}>
        {/* ... existing hamburger menu ... */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ textAlign: "center", fontSize: fontHeight.FONT28, fontWeight: "700", letterSpacing: 0.5, color: Colors.white }}>
            {Translate('Hello')} 👋
          </Text>
          {/* Add this */}
          <Text style={{ textAlign: "center", fontSize: fontHeight.FONT14, color: Colors.white, marginTop: 8, opacity: 0.9 }}>
            {DateFormatter.formatDate(currentDateTime, 'long')}
          </Text>
          <Text style={{ textAlign: "center", fontSize: fontHeight.FONT12, color: Colors.white, marginTop: 4, opacity: 0.8 }}>
            {DateFormatter.formatTime(currentDateTime, 'short', true)}
          </Text>
        </View>
      </SafeAreaView>
      {/* ... rest of component ... */}
    </View>
  );
};
```

---

## 🎯 Quick Implementation Checklist

- [ ] **DashboardScreen** - Add timestamps to list items
- [ ] **DashboardScreen** - Show last refresh time
- [ ] **DashboardScreen** - Display current date/time in header
- [ ] **SettingsScreen** - Show last version check time
- [ ] **SettingsScreen** - Display app installation date
- [ ] **ProfileScreen** - Show account creation and last login
- [ ] **UpdateDialog** - Display version release date
- [ ] **API Logs** - Already implemented ✅

---

## 📝 Translation Keys to Add

Add these to your `en.json` and `es.json` files:

```json
{
  "translation": {
    // ... existing translations ...
    "Last checked": "Last checked",
    "Last login": "Last login",
    "Account created": "Account created",
    "Released": "Released",
    "Installed on": "Installed on",
    "Version": "Version",
    "App Information": "App Information"
  }
}
```

**Spanish translations (es.json):**
```json
{
  "translation": {
    // ... existing translations ...
    "Last checked": "Última verificación",
    "Last login": "Último inicio de sesión",
    "Account created": "Cuenta creada",
    "Released": "Publicado",
    "Installed on": "Instalado el",
    "Version": "Versión",
    "App Information": "Información de la aplicación"
  }
}
```

---

## 💡 Best Practices

1. **Use relative time for recent events** - "2 hours ago" is more user-friendly than exact timestamps
2. **Cache dates in AsyncStorage** - Don't recalculate on every render
3. **Update timestamps periodically** - Use intervals for "live" times (like current time)
4. **Handle timezone differences** - The Intl API handles this automatically
5. **Format consistently** - Use the same style across similar UI elements

---

## 🔄 Dynamic Updates

The `DateFormatter` automatically updates when the user changes the app language. No additional code needed - it reads from `i18n.language` dynamically!

---

## 📚 See Also

- `DATE_TIME_LOCALIZATION.md` - Full API documentation
- `src/utils/DateFormatter.ts` - Implementation details

