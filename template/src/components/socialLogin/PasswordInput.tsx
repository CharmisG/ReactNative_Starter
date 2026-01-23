import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontHeight } from '../../styles/Fonts';
import { windowHeight } from '../../styles/Dimens';

interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    showPassword: boolean;
    onToggleVisibility: () => void;
    editable?: boolean;
    placeholder?: string;
}

const EyeIcon = React.memo(({ showPassword }: { showPassword: boolean }) => (
    <View style={styles.eyeIconGlyph}>
        <View style={styles.eyeOutline} />
        <View style={styles.eyePupil} />
        {!showPassword && <View style={styles.eyeSlash} />}
    </View>
));

EyeIcon.displayName = 'EyeIcon';

export const PasswordInput = React.memo<PasswordInputProps>(({
    value,
    onChangeText,
    showPassword,
    onToggleVisibility,
    editable = true,
    placeholder = 'Password',
}) => (
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.passwordInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.grey}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
        />
        <TouchableOpacity
            style={styles.eyeIcon}
            onPress={onToggleVisibility}
            disabled={!editable}
            activeOpacity={0.7}
        >
            <EyeIcon showPassword={showPassword} />
        </TouchableOpacity>
    </View>
));

PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: windowHeight(15),
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.silver,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        paddingHorizontal: windowHeight(10),
        paddingVertical: windowHeight(8),
        fontSize: fontHeight.FONT14,
        color: Colors.black,
        flex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: windowHeight(15),
        padding: windowHeight(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIconGlyph: {
        width: windowHeight(20),
        height: windowHeight(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeOutline: {
        position: 'absolute',
        width: windowHeight(16),
        height: windowHeight(10),
        borderWidth: 1.5,
        borderColor: Colors.charcoal,
        borderRadius: windowHeight(8),
        transform: [{ scaleX: 1.6 }],
    },
    eyePupil: {
        width: windowHeight(6),
        height: windowHeight(6),
        borderRadius: windowHeight(3),
        backgroundColor: Colors.charcoal,
    },
    eyeSlash: {
        position: 'absolute',
        width: windowHeight(18),
        height: 1.5,
        backgroundColor: Colors.charcoal,
        transform: [{ rotate: '-30deg' }],
    },
});

