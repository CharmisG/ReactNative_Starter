import { Text, View } from 'react-native';
import Translate from '../../hooks/Translate';
import NumberFormatter from '../../utils/NumberFormatter';
import { styles } from './SettingsCardStyles';

type CurrencyExampleCardProps = {
  themeColors: {
    cardBg: string;
    textColor: string;
  };
};

export const CurrencyExampleCard = ({ themeColors }: CurrencyExampleCardProps) => (
  <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
    <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
      {Translate('Currency Formatting Example')}
    </Text>
    <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 8 }]}>
      {Translate('Sample Price')}: {NumberFormatter.formatCurrency(99.99)}
    </Text>
    <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 6 }]}>
      {Translate('Discount')}: {NumberFormatter.formatCurrency(29.99)} ({NumberFormatter.formatPercentage(30, false)} {Translate('off')})
    </Text>
    <Text style={[styles.cardSubtitle, { color: themeColors.textColor, marginTop: 6 }]}>
      {Translate('Total')}: {NumberFormatter.formatCurrency(69.99)}
    </Text>
  </View>
);

