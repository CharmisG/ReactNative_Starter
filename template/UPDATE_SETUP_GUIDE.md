# Quick Setup Guide - App Update System

Follow these steps to get the update system working:

## 1. Configure Your App Version

**File:** `src/services/VersionService.ts`

```typescript
private currentVersion: string = '1.0.0'; // Update to your current app version
```

Or use package.json:

```typescript
import { version } from '../../package.json';

private currentVersion: string = version;
```

## 2. Set Store URLs

**File:** `src/services/VersionService.ts`

Replace with your actual store links:

```typescript
private appStoreUrl = 'https://apps.apple.com/app/yourapp/id123456789';
private playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourapp';
```

## 3. Configure API Endpoint

**File:** `src/services/VersionService.ts`, method `checkForUpdates()`

Replace the endpoint URL:

```typescript
const response = await fetch('https://your-api.com/api/version', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 4. API Response Format

Your backend should return:

```json
{
  "latestVersion": "1.2.0",
  "isForceUpdate": false,
  "message": "New features and bug fixes included"
}
```

## 5. Test the System

1. **Check Redux State:**
   ```typescript
   const { versionInfo, loading, error } = useSelector(
     (state: RootState) => state.Version
   );
   ```

2. **Trigger Update Check:**
   ```typescript
   dispatch(VersionSliceActions.checkVersionUpdate());
   ```

3. **Test in Your Settings Screen:**
   ```typescript
   const handleCheckUpdates = async () => {
     await dispatch(VersionSliceActions.checkVersionUpdate());
     showToast({ text: 'Checking for updates...', type: 'info' });
   };
   ```

## 6. Add Button to Settings Screen (Optional)

**File:** `src/screens/SettingsScreen.tsx`

Add this button after other test buttons:

```tsx
<Pressable
  style={({ pressed }) => [styles.commonStyles, styles.crashButton, pressed && styles.buttonPressedEffect]}
  onPress={handleCheckUpdates}
>
  <Text style={styles.buttonText}>Check for Updates</Text>
</Pressable>
```

Add handler:

```typescript
const handleCheckUpdates = async () => {
  try {
    await dispatch(VersionSliceActions.checkVersionUpdate());
  } catch (error) {
    console.error('Update check failed', error);
  }
};
```

Add translation keys (already added):

**en.json:**
```json
"Check for Updates": "Check for Updates"
```

**es.json:**
```json
"Check for Updates": "Buscar Actualizaciones"
```

## Files Created/Modified

### New Files:
- ✅ `src/services/VersionService.ts` - Version checking logic
- ✅ `src/redux/slices/VersionSlice.ts` - Redux state management
- ✅ `src/components/UpdateDialog.tsx` - Update prompt UI
- ✅ `UPDATE_SYSTEM_DOCS.md` - Full documentation

### Modified Files:
- ✅ `src/redux/Store.ts` - Added VersionSlice to store
- ✅ `App.tsx` - Integrated version checking and dialog
- ✅ `src/Localization/en.json` - Added update-related translations
- ✅ `src/Localization/es.json` - Added Spanish translations

## Features Included

✅ Automatic version checking on app startup  
✅ Periodic update checks (24-hour intervals)  
✅ Version comparison (semantic versioning)  
✅ Update dialog with version info  
✅ Force update support (disable "Later" button)  
✅ Platform-specific store links  
✅ Redux integration for state management  
✅ Localization support (EN, ES)  
✅ Error handling and fallbacks  
✅ Loading states and feedback  

## Testing Checklist

- [ ] Version service initializes correctly
- [ ] Update check triggers on app startup
- [ ] Update dialog appears when new version available
- [ ] "Update Now" opens correct app store
- [ ] "Later" button dismisses dialog (if not forced)
- [ ] Force update disables "Later" button
- [ ] Works on iOS (App Store)
- [ ] Works on Android (Play Store)
- [ ] Handles network errors gracefully
- [ ] Handles invalid API responses

## Next Steps

1. Update `currentVersion` in `VersionService.ts`
2. Set your store URLs
3. Configure your API endpoint
4. Test with your backend
5. Deploy to production

For detailed documentation, see `UPDATE_SYSTEM_DOCS.md`
