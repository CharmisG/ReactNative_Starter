import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import Translate from '../../hooks/Translate';
import { styles } from './SettingsCardStyles';

interface ShareButtonProps {
    onPress: () => void;
    isLoading?: boolean;
    themeColors: {
        cardBg: string;
        textColor: string;
        accentColor: string;
    };
}

export const ShareButton = React.memo<ShareButtonProps>(({
    onPress,
    isLoading = false,
    themeColors,
}) => (
    <Pressable
        style={({ pressed }) => [
            styles.card,
            { backgroundColor: themeColors.cardBg },
            pressed && styles.buttonPressedEffect,
        ]}
        onPress={onPress}
        disabled={isLoading}
    >
        <View style={styles.rowBetween}>
            <View style={styles.flexRow}>
                <Text style={styles.shareIcon}>📤</Text>
                <View style={styles.shareTextContainer}>
                    <Text style={[styles.cardTitle, { color: themeColors.textColor }]}>
                        {Translate('Share App')}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: themeColors.accentColor }]}>
                        {Translate('Share with friends')}
                    </Text>
                </View>
            </View>
            {isLoading ? (
                <ActivityIndicator size="small" color={themeColors.accentColor} />
            ) : (
                <Text style={[styles.shareArrow, { color: themeColors.accentColor }]}>›</Text>
            )}
        </View>
    </Pressable>
));

ShareButton.displayName = 'ShareButton';

