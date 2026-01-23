import React from 'react';
import { View, Text, Image, Pressable, Animated, SafeAreaView, Platform } from 'react-native';
import { AppConstants } from '../../constants/AppConstants';
import Colors from '../../styles/Colors';
import { MenuModalStyles } from './DashboardStyles';

interface MenuOption {
    title: string;
    icon: any;
    action: () => void;
}

interface MenuModalProps {
    visible: boolean;
    scale: Animated.Value;
    appTheme: string;
    options: MenuOption[];
    onClose: () => void;
}

export const MenuModal = React.memo<MenuModalProps>(({
    visible,
    scale,
    appTheme,
    options,
    onClose,
}) => {
    const backgroundColor = appTheme === AppConstants.dark ? Colors.black : Colors.white;
    const textColor = appTheme === AppConstants.dark ? Colors.white : Colors.black;
    const iconTintColor = appTheme === AppConstants.dark ? Colors.white : Colors.black;

    return (
        <SafeAreaView
            style={MenuModalStyles.modalContainer}
            onTouchStart={onClose}
        >
            <Animated.View
                style={[
                    MenuModalStyles.popup,
                    {
                        backgroundColor,
                        opacity: scale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                        transform: [{ scale }],
                    },
                ]}
            >
                {options.map((op, i) => (
                    <Pressable key={i} onPress={op.action}>
                        <View style={MenuModalStyles.optionContainer}>
                            <Image
                                source={op.icon}
                                style={[
                                    MenuModalStyles.optionIcon,
                                    { tintColor: iconTintColor },
                                ]}
                            />
                            <Text style={[MenuModalStyles.optionText, { color: textColor }]}>
                                {op.title}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </Animated.View>
        </SafeAreaView>
    );
});

MenuModal.displayName = 'MenuModal';

