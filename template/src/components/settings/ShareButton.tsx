import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import Translate from '../../hooks/Translate';
import { styles } from './SettingsCardStyles';
import Colors from '../../styles/Colors';

interface ShareButtonProps {
    onPress: () => void;
    isLoading?: boolean;
}

export const ShareButton = React.memo<ShareButtonProps>(({
    onPress,
    isLoading = false,
}) => (
    <Pressable
        style={({ pressed }) => [
            styles.commonStyles,
            styles.libraryButton, // accent background like other action buttons
            pressed && styles.buttonPressedEffect,
        ]}
        onPress={onPress}
        disabled={isLoading}
    >
        <View style={styles.rowBetween}>
            <Text style={styles.buttonText}>{Translate('Share App')}</Text>
            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
            ) : (
                <Text style={styles.buttonText}>{Translate('Share')}</Text>
            )}
        </View>
    </Pressable>
));

ShareButton.displayName = 'ShareButton';

