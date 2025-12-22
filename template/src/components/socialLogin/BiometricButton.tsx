import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../styles/Colors';
import { fontHeight } from '../../styles/Fonts';
import { windowHeight } from '../../styles/Dimens';

interface BiometricButtonProps {
    onPress: () => void;
    text: string;
    isLoading?: boolean;
    disabled?: boolean;
}

export const BiometricButton = React.memo<BiometricButtonProps>(({
    onPress,
    text,
    isLoading = false,
    disabled = false,
}) => (
    <TouchableOpacity
        style={[
            styles.biometricButton,
            (isLoading || disabled) && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={isLoading || disabled}
        activeOpacity={0.7}
    >
        <View style={styles.buttonContent}>
            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
            ) : (
                <Text style={styles.biometricIcon}>🔐</Text>
            )}
            <Text style={styles.biometricButtonText}>
                {isLoading ? 'Authenticating...' : text}
            </Text>
        </View>
    </TouchableOpacity>
));

BiometricButton.displayName = 'BiometricButton';

const styles = StyleSheet.create({
    biometricButton: {
        width: '100%',
        paddingVertical: windowHeight(14),
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: windowHeight(10),
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    biometricIcon: {
        fontSize: fontHeight.FONT20,
        marginRight: windowHeight(8),
    },
    biometricButtonText: {
        color: Colors.white,
        fontSize: fontHeight.FONT16,
        fontWeight: '700',
    },
});

