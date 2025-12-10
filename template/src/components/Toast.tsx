import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../styles/Colors';
import { fontHeight } from '../styles/Fonts';
import { windowWidth, windowHeight } from '../styles/Dimens';

type Props = {
    title?: string;
    text: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    onClose?: () => void;
    imageSource?: ImageSourcePropType;
    showSpinner?: boolean;
};

const Toast: React.FC<Props> = ({ title, text, type = 'info', onClose, imageSource }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        return () => { };
    }, [anim]);

    const variants = {
        success: { accent: '#2e7d32', bg: '#e8f5e9' },
        error: { accent: '#c62828', bg: '#ffebee' },
        warning: { accent: '#f57f17', bg: '#fff8e1' },
        info: { accent: '#1976d2', bg: '#e3f2fd' },
    } as const;

    const v = variants[type ?? 'info'];
    const defaultTitle =
        type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Informational';

    return (
        <Animated.View
            style={[
                styles.toast,
                { backgroundColor: v.bg, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
            ]}>
            {/* left accent bar */}
            <View style={[styles.accent, { backgroundColor: v.accent }]} />

            {/* circular icon or image */}
            <View style={[styles.iconWrap, { backgroundColor: v.accent }]}>
                {imageSource ? (
                    <Image source={imageSource} style={styles.iconImage} />
                ) : (
                    <Text style={styles.iconText}>{type === 'success' ? '✔' : type === 'error' ? '✖' : type === 'warning' ? '!' : 'i'}</Text>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{(title ?? defaultTitle)}</Text>
                <Text style={styles.message}>{text}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeArea} accessibilityRole="button">
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    text: {
        color: Colors.charcoal || '#263238',
        fontSize: fontHeight.FONT14,
        flex: 1,
    },
    closeArea: {
        marginLeft: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    closeText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 16,
        fontWeight: '600',
    },
    image: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    accent: {
        width: 6,
        height: '100%',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        marginRight: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: fontHeight.FONT16,
        fontWeight: '700',
        color: Colors.charcoal || '#263238',
        marginBottom: 4,
    },
    message: {
        fontSize: fontHeight.FONT14,
        color: Colors.charcoal || '#263238',
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    iconImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#fff',
    },
});

export default Toast;
