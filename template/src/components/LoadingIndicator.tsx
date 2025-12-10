import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle, Image, ImageStyle, ImageSourcePropType } from 'react-native';
import Colors from '../styles/Colors';
import { windowHeight, windowWidth } from '../styles/Dimens';
import { fontHeight } from '../styles/Fonts';

type Props = {
    size?: 'small' | 'large' | number;
    color?: string;
    text?: string;
    style?: ViewStyle;
    inline?: boolean; // inline (no container) vs centered overlay
    imageSource?: ImageSourcePropType;
    imageStyle?: ImageStyle;
    showSpinner?: boolean;
};

const LoadingIndicator: React.FC<Props> = ({
    size = 'small',
    color = Colors.primary,
    text,
    style,
    inline = false,
    imageSource,
    imageStyle,
    showSpinner = true,
}) => {
    if (inline) {
        return (
            <View style={[styles.inlineContainer, style as any]}>
                {/* {imageSource ? <Image source={imageSource} style={[styles.inlineImage, imageStyle as any]} /> : null} */}
                {showSpinner && <ActivityIndicator size={size as any} color={color} />}
                {text ? <Text style={[styles.inlineText, { color }]}>{text}</Text> : null}
            </View>
        );
    }

    return (
        <View style={[styles.container, style as any]}>
            {/* {imageSource ? <Image source={imageSource} style={[styles.image, imageStyle as any]} /> : null} */}
            {showSpinner && <ActivityIndicator size={size as any} color={color} />}
            {text ? <Text style={styles.text}>{text}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: windowHeight(10),
        fontSize: fontHeight.FONT16,
        color: Colors.black,
    },
    inlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inlineImage: {
        width: 18,
        height: 18,
        marginRight: windowWidth(6),
        resizeMode: 'contain',
    },
    inlineText: {
        marginLeft: windowWidth(8),
        fontSize: fontHeight.FONT14,
    },
    image: {
        width: windowWidth(64),
        height: windowHeight(64),
        marginBottom: windowHeight(8),
        resizeMode: 'contain',
    },
});

export default LoadingIndicator;
