import { Text, View } from 'react-native';
import { useMemo } from 'react';
import Translate from '../../hooks/Translate';
import UnitFormatter from '../../utils/UnitFormatter';
import { styles } from './SettingsCardStyles';

type UnitsExampleCardProps = {
  themeColors: {
    cardBg: string;
    textColor: string;
  };
};

export const UnitsExampleCard = ({ themeColors }: UnitsExampleCardProps) => {
  // Example values
  const distance = useMemo(() => 1500, []); // 1500 meters
 const temperature = useMemo(() => 25, []); // 25°C
 
  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
      <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
        {Translate('Units & Measurements Example')}
      </Text>

      <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 12, fontWeight: '600' }]}>
        {Translate('Distance')}:
      </Text>
      <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
        {distance} m = {UnitFormatter.formatDistance(distance)}
      </Text>


      <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 12, fontWeight: '600' }]}>
        {Translate('Temperature')}:
      </Text>
      <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 4 }]}>
        {temperature}°C = {UnitFormatter.formatTemperature(temperature)}
      </Text>

    </View>
  );
};

