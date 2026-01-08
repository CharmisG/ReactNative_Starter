import React, { useMemo } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../styles/Colors';
import Translate from '../../hooks/Translate';
import { RootState } from '../../redux/store';
import { AppConstants } from '../../constants/AppConstants';

const createModalStyles = (appTheme: string) => {
    const isDark = appTheme === AppConstants.dark;

    return StyleSheet.create({
        modalContent: {
            backgroundColor: isDark ? '#1e293b' : Colors.white,
            padding: 24,
            borderRadius: 16,
            width: '85%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 8,
            color: isDark ? '#f1f5f9' : '#1e293b',
        },
        modalNetworkName: {
            marginBottom: 20,
            color: isDark ? '#cbd5e1' : '#475569',
            fontSize: 15,
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
            padding: 12,
            borderRadius: 8,
            fontWeight: '600',
        },
        modalInput: {
            borderWidth: 2,
            borderColor: isDark ? '#475569' : '#e2e8f0',
            borderRadius: 10,
            padding: 14,
            marginBottom: 20,
            fontSize: 16,
            backgroundColor: isDark ? '#0f172a' : Colors.white,
            color: isDark ? '#f1f5f9' : '#1e293b',
        },
        modalInputFocused: {
            borderColor: '#6366f1',
        },
        cancelButton: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
        },
        cancelButtonText: {
            color: isDark ? '#cbd5e1' : '#475569',
            fontSize: 15,
            fontWeight: '600',
        },
    });
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    connectButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#6366f1',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    connectButtonDisabled: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
    },
    connectButtonText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '700',
    },
});

interface WiFiPasswordModalProps {
    visible: boolean;
    networkToConnect: string | null;
    wifiPassword: string;
    onPasswordChange: (password: string) => void;
    onConnect: () => void;
    onClose: () => void;
}

export const WiFiPasswordModal: React.FC<WiFiPasswordModalProps> = ({
    visible,
    networkToConnect,
    wifiPassword,
    onPasswordChange,
    onConnect,
    onClose,
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const themeStyles = useMemo(() => createModalStyles(appTheme), [appTheme]);

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={themeStyles.modalContent}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <View style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: '#6366f1' }} />
                        <Text style={themeStyles.modalTitle}>{Translate('Enter Password')}</Text>
                    </View>
                    <Text style={themeStyles.modalNetworkName}>
                        {networkToConnect}
                    </Text>
                    <TextInput
                        style={[themeStyles.modalInput, isFocused && themeStyles.modalInputFocused]}
                        placeholder={Translate('Enter WiFi password')}
                        placeholderTextColor="#94a3b8"
                        secureTextEntry
                        value={wifiPassword}
                        onChangeText={onPasswordChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        autoFocus
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={themeStyles.cancelButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={themeStyles.cancelButtonText}>{Translate('Cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.connectButton,
                                !wifiPassword && styles.connectButtonDisabled,
                            ]}
                            onPress={onConnect}
                            disabled={!wifiPassword}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.connectButtonText}>{Translate('Connect')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

