import { Text, View, Switch, Pressable, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Translate from '../../hooks/Translate';
import DateFormatter from '../../utils/DateFormatter';
import { FeatureFlags } from '../../config/AppConfig';
import { styles } from './SettingsCardStyles';
import { CurrencyExampleCard } from './CurrencyExampleCard';
import { DateTimeExampleCard } from './DateTimeExampleCard';
import { UnitsExampleCard } from './UnitsExampleCard';
import { ShareButton } from './ShareButton';

type SettingsCardsProps = {
    themeColors: any;
    enabled: boolean;
    darkTheme: boolean;
    selectedLanguage: string;
    settingsList: any[];
    localizationEnabled: boolean;
    lastVersionCheck: Date | null;
    appInstalledDate: Date | null;
    selectedImageUri: string | null;
    onLanguageChanged: (val: string) => void;
    toggleSwitch: () => void;
    changeEnabled: (value: boolean) => void;
    showLogFilePaths: () => void;
    onCrashlyticsTest: () => void;
    onAnalyticsTest: () => void;
    onShowToast: () => void;
    onCheckAppVersion: () => void;
    onPickImageFromLibrary: () => void;
    onCaptureImageWithCamera: () => void;
    onShareApp: () => void;
    isSharing: boolean;
};

export const SettingsCards = ({
    themeColors,
    enabled,
    darkTheme,
    selectedLanguage,
    settingsList,
    localizationEnabled,
    lastVersionCheck,
    appInstalledDate,
    selectedImageUri,
    onLanguageChanged,
    toggleSwitch,
    changeEnabled,
    showLogFilePaths,
    onCrashlyticsTest,
    onAnalyticsTest,
    onShowToast,
    onCheckAppVersion,
    onPickImageFromLibrary,
    onCaptureImageWithCamera,
    onShareApp,
    isSharing,
}: SettingsCardsProps) => (
    <>
        {localizationEnabled && (
            <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
                <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
                    {Translate('Change Language')}
                </Text>
                <Dropdown
                    data={settingsList}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    labelField="name"
                    valueField="value"
                    placeholder={Translate('Select Language')}
                    value={selectedLanguage}
                    onChange={item => onLanguageChanged(item.value)}
                />
            </View>
        )}

        <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
            <View style={styles.rowBetween}>
                <View>
                    <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
                        {Translate('Change Appearance')}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: themeColors.accentColor }]}>
                        {darkTheme ? Translate('Dark') : Translate('Light')}
                    </Text>
                </View>
                <Switch value={darkTheme} onValueChange={toggleSwitch} />
            </View>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
            <View style={styles.rowBetween}>
                <View>
                    <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
                        {Translate('Filebase Logging')}
                    </Text>
                    <Text onPress={showLogFilePaths} style={[styles.cardSubtitle, styles.textLink, { color: themeColors.accentColor }]}>
                        {Translate('Show file paths')}
                    </Text>
                </View>
                <Switch value={enabled} onValueChange={changeEnabled} />
            </View>
        </View>

        {[
            { onPress: onCrashlyticsTest, text: Translate('Test Crashlytics') },
            { onPress: onAnalyticsTest, text: Translate('Test Analytics') },
            { onPress: onShowToast, text: Translate('Show Toast') },
            { onPress: onCheckAppVersion, text: Translate('Check for Updates') },
        ].map((btn, idx) => (
            <Pressable
                key={idx}
                style={({ pressed }) => [styles.commonStyles, styles.crashButton, pressed && styles.buttonPressedEffect]}
                onPress={btn.onPress}
            >
                <Text style={styles.buttonText}>{btn.text}</Text>
            </Pressable>
        ))}

        {FeatureFlags.settingsScreen?.showLastVersionCheck && lastVersionCheck && (
            <View style={[styles.infoTextContainer, { backgroundColor: themeColors.infoContainerBg }]}>
                <Text style={[styles.infoText, { color: themeColors.textColor }]}>
                    {Translate('Last checked')}: {DateFormatter.formatDateTime(lastVersionCheck, 'short', 'short', true)}
                </Text>
            </View>
        )}

        {FeatureFlags.settingsScreen?.showCurrencyExample && <CurrencyExampleCard themeColors={themeColors} />}
        {FeatureFlags.settingsScreen?.showDateTimeExample && (
            <DateTimeExampleCard themeColors={themeColors} appInstalledDate={appInstalledDate} />
        )}
        {FeatureFlags.settingsScreen?.showUnitsExample && <UnitsExampleCard themeColors={themeColors} />}

        {FeatureFlags.settingsScreen?.showSocialShare && FeatureFlags.socialShare?.enabled && (
            <ShareButton
                onPress={onShareApp}
                isLoading={isSharing}
                themeColors={themeColors}
            />
        )}

        {(FeatureFlags?.mediaPicker?.camera || FeatureFlags?.mediaPicker?.gallery) && (
            <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
                <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
                    {Translate('Profile Image')}
                </Text>
                <View style={styles.buttonRow}>
                    {FeatureFlags?.mediaPicker?.camera && (
                        <Pressable
                            style={({ pressed }) => [styles.diagButton, styles.cameraButton, pressed && styles.buttonPressedEffect]}
                            onPress={onCaptureImageWithCamera}
                        >
                            <Text style={styles.buttonText}>{Translate('Open Camera')}</Text>
                        </Pressable>
                    )}
                    {FeatureFlags?.mediaPicker?.gallery && (
                        <Pressable
                            style={({ pressed }) => [styles.diagButton, styles.libraryButton, pressed && styles.buttonPressedEffect]}
                            onPress={onPickImageFromLibrary}
                        >
                            <Text style={styles.buttonText}>{Translate('Pick from Gallery')}</Text>
                        </Pressable>
                    )}
                </View>
                {selectedImageUri && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: selectedImageUri }} style={styles.previewImage} resizeMode="cover" />
                        <Text style={[styles.previewLabel, { color: themeColors.textColor }]}>
                            {Translate('Selected Image')}
                        </Text>
                    </View>
                )}
            </View>
        )}
    </>
);

