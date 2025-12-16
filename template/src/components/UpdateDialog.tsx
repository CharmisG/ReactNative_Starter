import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { VersionInfo } from '../services/VersionService';
import Colors from '../styles/Colors';
import { fontHeight } from '../styles/Fonts';
import { windowHeight, windowWidth } from '../styles/Dimens';
import versionService from '../services/VersionService';

type Props = {
    visible: boolean;
    versionInfo: VersionInfo | null;
    onDismiss: () => void;
};

const UpdateDialog: React.FC<Props> = ({ visible, versionInfo, onDismiss }) => {
    const [updating, setUpdating] = useState(false);

    if (!versionInfo || !versionInfo.isUpdateAvailable) {
        return null;
    }

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            const storeUrl = versionInfo.updateUrl || versionService.getStoreUrl();
            await versionService.openUpdateUrl(storeUrl);
        } catch (error) {
            console.error('Failed to open update URL', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDismiss = () => {
        if (!versionInfo.isForceUpdate) {
            onDismiss();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.dialogContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerIcon}>📦</Text>
                        <Text style={styles.title}>New Version Available</Text>
                    </View>

                    {/* Version Info */}
                    <View style={styles.versionInfo}>
                        <View style={styles.versionRow}>
                            <Text style={styles.label}>Current Version:</Text>
                            <Text style={styles.versionValue}>{versionInfo.currentVersion}</Text>
                        </View>
                        <View style={styles.versionRow}>
                            <Text style={styles.label}>Latest Version:</Text>
                            <Text style={[styles.versionValue, { color: Colors.primary }]}>
                                {versionInfo.latestVersion}
                            </Text>
                        </View>
                    </View>

                    {/* Message */}
                    <Text style={styles.message}>
                        {versionInfo.updateMessage ||
                            'A new version is available. Please update to get the latest features and security improvements.'}
                    </Text>

                    {/* Force Update Notice */}
                    {versionInfo.isForceUpdate && (
                        <View style={styles.forceUpdateNotice}>
                            <Text style={styles.forceUpdateText}>
                                ⚠️ This is a required update. Please update to continue using the app.
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        {!versionInfo.isForceUpdate && (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.laterButton,
                                    pressed && styles.buttonPressed,
                                ]}
                                onPress={handleDismiss}
                                disabled={updating}
                            >
                                <Text style={styles.laterButtonText}>Later</Text>
                            </Pressable>
                        )}

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.updateButton,
                                pressed && styles.buttonPressed,
                                updating && styles.buttonDisabled,
                            ]}
                            onPress={handleUpdate}
                            disabled={updating}
                        >
                            {updating ? (
                                <ActivityIndicator color={Colors.white} size="small" />
                            ) : (
                                <Text style={styles.updateButtonText}>Update Now</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    dialogContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 28,
        elevation: 8,
        shadowColor: Colors.black,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        maxWidth: windowWidth(90),
    },

    header: {
        alignItems: 'center',
        marginBottom: 20,
    },

    headerIcon: {
        fontSize: 48,
        marginBottom: 12,
    },

    title: {
        fontSize: fontHeight.FONT20,
        fontWeight: '700',
        color: Colors.charcoal,
        textAlign: 'center',
    },

    versionInfo: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
    },

    versionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    label: {
        fontSize: fontHeight.FONT14,
        color: Colors.grey,
        fontWeight: '500',
    },

    versionValue: {
        fontSize: fontHeight.FONT14,
        fontWeight: '700',
        color: Colors.charcoal,
    },

    message: {
        fontSize: fontHeight.FONT14,
        color: Colors.charcoal,
        lineHeight: 20,
        marginBottom: 16,
        textAlign: 'center',
    },

    forceUpdateNotice: {
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
    },

    forceUpdateText: {
        fontSize: fontHeight.FONT13,
        color: '#e65100',
        fontWeight: '600',
    },

    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end',
    },

    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
    },

    laterButton: {
        backgroundColor: Colors.lightGrey,
        flex: 1,
    },

    updateButton: {
        backgroundColor: Colors.primary,
        flex: 1,
    },

    buttonPressed: {
        opacity: 0.8,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    laterButtonText: {
        color: Colors.charcoal,
        fontWeight: '600',
        fontSize: fontHeight.FONT14,
    },

    updateButtonText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: fontHeight.FONT14,
    },
});

export default UpdateDialog;
