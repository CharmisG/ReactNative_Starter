import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontHeight } from '../../styles/Fonts';
import { windowHeight } from '../../styles/Dimens';

interface EmailInputProps {
    value: string;
    onChangeText: (text: string) => void;
    editable?: boolean;
    placeholder?: string;
}

export const EmailInput = React.memo<EmailInputProps>(({
    value,
    onChangeText,
    editable = true,
    placeholder = 'Email',
}) => (
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.grey}
            value={value}
            onChangeText={onChangeText}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
        />
    </View>
));

EmailInput.displayName = 'EmailInput';

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
    input: {
        paddingHorizontal: windowHeight(10),
        paddingVertical: windowHeight(8),
        fontSize: fontHeight.FONT14,
        color: Colors.black,
        flex: 1,
    },
});

