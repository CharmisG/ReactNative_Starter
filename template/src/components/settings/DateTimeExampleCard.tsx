import { Text, View } from 'react-native';
import { useMemo } from 'react';
import Translate from '../../hooks/Translate';
import DateFormatter from '../../utils/DateFormatter';
import { FeatureFlags } from '../../config/AppConfig';
import { styles } from './SettingsCardStyles';

type DateTimeExampleCardProps = {
  themeColors: {
    cardBg: string;
    textColor: string;
  };
  appInstalledDate: Date | null;
};

export const DateTimeExampleCard = ({ themeColors, appInstalledDate }: DateTimeExampleCardProps) => {
  const now = useMemo(() => new Date(), []);
  const twoHoursAgo = useMemo(() => new Date(Date.now() - 2 * 60 * 60 * 1000), []);
  const tomorrow = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000), []);

  const dateTimeConfig = FeatureFlags.settingsScreen?.dateTimeExample;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
      <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
        {Translate('Date & Time Formatting Example')}
      </Text>

      {dateTimeConfig?.showCurrentDateTime && (
        <>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 8, fontWeight: '600' }]}>
            {Translate('Current Date & Time')}:
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {DateFormatter.formatDateTime(now, 'long', 'short', true)}
          </Text>
        </>
      )}

      {dateTimeConfig?.showDateFormats && (
        <>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 12, fontWeight: '600' }]}>
            {Translate('Date Formats')}:
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('Short')}: {DateFormatter.formatDate(now, 'short')}
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('Medium')}: {DateFormatter.formatDate(now, 'medium')}
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('Long')}: {DateFormatter.formatDate(now, 'long')}
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('Full')}: {DateFormatter.formatDate(now, 'full')}
          </Text>
        </>
      )}

      {dateTimeConfig?.showTimeFormats && (
        <>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 12, fontWeight: '600' }]}>
            {Translate('Time Formats')}:
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('12-hour')}: {DateFormatter.formatTime(now, 'short', true)}
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('24-hour')}: {DateFormatter.formatTime(now, 'short', false)}
          </Text>
        </>
      )}

      {dateTimeConfig?.showRelativeTime && (
        <>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 12, fontWeight: '600' }]}>
            {Translate('Relative Time')}:
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('2 hours ago')}: {DateFormatter.formatRelative(twoHoursAgo, 'short')}
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {Translate('Tomorrow')}: {DateFormatter.formatRelative(tomorrow, 'short')}
          </Text>
        </>
      )}

      {dateTimeConfig?.showAppInstalledRelative && appInstalledDate && (
        <>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 12, fontWeight: '600' }]}>
            {Translate('App Installed')}:
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
            {DateFormatter.formatRelative(appInstalledDate, 'short')}
          </Text>
        </>
      )}
    </View>
  );
};

