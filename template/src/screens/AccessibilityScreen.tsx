import React, { useMemo, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { RootState } from '../redux/store';
import Navbar from '../components/Navbar';
import { useAccessibilityScreen } from '../hooks/useAccessibilityScreen';
import { createAccessibilityStyles } from '../components/accessibility/AccessibilityStyles';
import {
    Section,
    StatusRow,
    FontScaleControls,
    HighContrastToggle,
    TouchTargetControls,
    MIN_TOUCH_TARGET,
    MAX_TOUCH_TARGET,
    TOUCH_TARGET_STEP,
    DEFAULT_TOUCH_TARGET,
} from '../components/accessibility/AccessibilityComponents';
import Translate from '../hooks/Translate';

type Props = NativeStackScreenProps<RootStackParamList, 'Accessibility'>;

const AccessibilityScreen = ({ navigation }: Props) => {
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const styles = useMemo(() => createAccessibilityStyles(appTheme), [appTheme]);
    const {
        isAccessibilityEnabled,
        isScreenReaderEnabled,
        fontScale,
        highContrastEnabled,
        minimumTouchTarget,
        increaseFontScale,
        decreaseFontScale,
        resetFontScale,
        toggleHighContrast,
        setMinimumTouchTargetValue,
        announceForAccessibility,
    } = useAccessibilityScreen();

    const screenTitle = useMemo(() => Translate('Accessibility'), []);
    const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

    const handleFontIncrease = useCallback(() => {
        increaseFontScale();
        announceForAccessibility(Translate('Font size increased'));
    }, [increaseFontScale, announceForAccessibility]);

    const handleFontDecrease = useCallback(() => {
        decreaseFontScale();
        announceForAccessibility(Translate('Font size decreased'));
    }, [decreaseFontScale, announceForAccessibility]);

    const handleHighContrastToggle = useCallback(() => {
        const newValue = !highContrastEnabled;
        toggleHighContrast();
        announceForAccessibility(
            newValue ? Translate('High contrast enabled') : Translate('High contrast disabled')
        );
    }, [toggleHighContrast, highContrastEnabled, announceForAccessibility]);

    const handleTouchTargetDecrease = useCallback(() => {
        setMinimumTouchTargetValue(Math.max(MIN_TOUCH_TARGET, minimumTouchTarget - TOUCH_TARGET_STEP));
        announceForAccessibility(Translate('Touch target size decreased'));
    }, [minimumTouchTarget, setMinimumTouchTargetValue, announceForAccessibility]);

    const handleTouchTargetIncrease = useCallback(() => {
        setMinimumTouchTargetValue(Math.min(MAX_TOUCH_TARGET, minimumTouchTarget + TOUCH_TARGET_STEP));
        announceForAccessibility(Translate('Touch target size increased'));
    }, [minimumTouchTarget, setMinimumTouchTargetValue, announceForAccessibility]);

    const handleTouchTargetReset = useCallback(() => {
        setMinimumTouchTargetValue(DEFAULT_TOUCH_TARGET);
        announceForAccessibility(Translate('Touch target size reset'));
    }, [setMinimumTouchTargetValue, announceForAccessibility]);

    if (!isAccessibilityEnabled) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{Translate('Accessibility is disabled')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Section title={Translate('Screen Reader')} styles={styles}>
                    <StatusRow
                        label={Translate('Status')}
                        value={isScreenReaderEnabled}
                        styles={styles}
                    />
                </Section>

                <Section title={Translate('Text Size')} styles={styles}>
                    <FontScaleControls
                        fontScale={fontScale}
                        onIncrease={handleFontIncrease}
                        onDecrease={handleFontDecrease}
                        onReset={resetFontScale}
                        styles={styles}
                    />
                </Section>

                <Section title={Translate('Display')} styles={styles}>
                    <HighContrastToggle
                        enabled={highContrastEnabled}
                        onToggle={handleHighContrastToggle}
                        styles={styles}
                    />
                </Section>


                <Section title={Translate('Touch Targets')} styles={styles}>
                    <TouchTargetControls
                        value={minimumTouchTarget}
                        onDecrease={handleTouchTargetDecrease}
                        onIncrease={handleTouchTargetIncrease}
                        onReset={handleTouchTargetReset}
                        styles={styles}
                    />
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccessibilityScreen;


