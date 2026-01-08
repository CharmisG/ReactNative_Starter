import { useState, useCallback, useEffect, useMemo } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FeatureFlags } from '../config/AppConfig';
import Translate from './Translate';

export interface AccessibilitySettings {
    screenReaderEnabled: boolean;
    reducedMotionEnabled: boolean;
    largeTextEnabled: boolean;
    highContrastEnabled: boolean;
    fontScale: number;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    minimumTouchTarget: number;
    announceActions: boolean;
}

const DEFAULT_FONT_SCALE = 1.0;
const MIN_FONT_SCALE = 0.85;
const MAX_FONT_SCALE = 2.0;
const FONT_SCALE_STEP = 0.1;

export const useAccessibilityScreen = () => {
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
    const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
    const [isReducedTransparencyEnabled, setIsReducedTransparencyEnabled] = useState(false);
    const [isGrayscaleEnabled, setIsGrayscaleEnabled] = useState(false);
    const [isInvertColorsEnabled, setIsInvertColorsEnabled] = useState(false);
    const [fontScale, setFontScale] = useState(DEFAULT_FONT_SCALE);
    const [highContrastEnabled, setHighContrastEnabled] = useState(false);
    const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none');
    const [minimumTouchTarget, setMinimumTouchTarget] = useState(48);

    const accessibilityConfig = FeatureFlags.accessibility;
    const isAccessibilityEnabled = accessibilityConfig?.enabled ?? true;

    const updateAccessibilityState = useCallback(async () => {
        if (!isAccessibilityEnabled) return;

        const screenReader = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(screenReader);

        if (Platform.OS === 'ios') {
            const reducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
            setIsReducedMotionEnabled(reducedMotion);

            const reducedTransparency = await AccessibilityInfo.isReduceTransparencyEnabled();
            setIsReducedTransparencyEnabled(reducedTransparency);

            const grayscale = await AccessibilityInfo.isGrayscaleEnabled();
            setIsGrayscaleEnabled(grayscale);

            const invertColors = await AccessibilityInfo.isInvertColorsEnabled();
            setIsInvertColorsEnabled(invertColors);
        } else {
            const reducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
            setIsReducedMotionEnabled(reducedMotion);
        }
    }, [isAccessibilityEnabled]);

    useEffect(() => {
        updateAccessibilityState();

        const screenReaderChangeHandler = AccessibilityInfo.addEventListener(
            'screenReaderChanged',
            updateAccessibilityState,
        );
        const reduceMotionChangeHandler = AccessibilityInfo.addEventListener(
            'reduceMotionChanged',
            updateAccessibilityState,
        );

        let reduceTransparencyChangeHandler: any;
        let grayscaleChangeHandler: any;
        let invertColorsChangeHandler: any;

        if (Platform.OS === 'ios') {
            reduceTransparencyChangeHandler = AccessibilityInfo.addEventListener(
                'reduceTransparencyChanged',
                updateAccessibilityState,
            );
            grayscaleChangeHandler = AccessibilityInfo.addEventListener(
                'grayscaleChanged',
                updateAccessibilityState,
            );
            invertColorsChangeHandler = AccessibilityInfo.addEventListener(
                'invertColorsChanged',
                updateAccessibilityState,
            );
        }

        return () => {
            screenReaderChangeHandler.remove();
            reduceMotionChangeHandler.remove();
            if (Platform.OS === 'ios') {
                reduceTransparencyChangeHandler?.remove();
                grayscaleChangeHandler?.remove();
                invertColorsChangeHandler?.remove();
            }
        };
    }, [updateAccessibilityState]);

    const increaseFontScale = useCallback(() => {
        setFontScale((prev) => Math.min(prev + FONT_SCALE_STEP, MAX_FONT_SCALE));
    }, []);

    const decreaseFontScale = useCallback(() => {
        setFontScale((prev) => Math.max(prev - FONT_SCALE_STEP, MIN_FONT_SCALE));
    }, []);

    const resetFontScale = useCallback(() => {
        setFontScale(DEFAULT_FONT_SCALE);
    }, []);

    const toggleHighContrast = useCallback(() => {
        setHighContrastEnabled((prev) => !prev);
    }, []);

    const setColorBlindModeValue = useCallback((mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => {
        setColorBlindMode(mode);
    }, []);

    const setMinimumTouchTargetValue = useCallback((size: number) => {
        setMinimumTouchTarget(size);
    }, []);

    const announceForAccessibility = useCallback((message: string) => {
        if (accessibilityConfig?.enabled && accessibilityConfig?.announceActions) {
            AccessibilityInfo.announceForAccessibility(message);
        }
    }, [accessibilityConfig]);

    const accessibilitySettings: AccessibilitySettings = useMemo(
        () => ({
            screenReaderEnabled: isScreenReaderEnabled,
            reducedMotionEnabled: isReducedMotionEnabled,
            largeTextEnabled: fontScale > DEFAULT_FONT_SCALE,
            highContrastEnabled,
            fontScale,
            colorBlindMode,
            minimumTouchTarget,
            announceActions: accessibilityConfig?.announceActions ?? true,
        }),
        [
            isScreenReaderEnabled,
            isReducedMotionEnabled,
            fontScale,
            highContrastEnabled,
            colorBlindMode,
            minimumTouchTarget,
            accessibilityConfig,
        ]
    );

    return {
        isAccessibilityEnabled,
        isScreenReaderEnabled,
        isReducedMotionEnabled,
        isReducedTransparencyEnabled,
        isGrayscaleEnabled,
        isInvertColorsEnabled,
        fontScale,
        highContrastEnabled,
        colorBlindMode,
        minimumTouchTarget,
        accessibilitySettings,
        increaseFontScale,
        decreaseFontScale,
        resetFontScale,
        toggleHighContrast,
        setColorBlindModeValue,
        setMinimumTouchTargetValue,
        announceForAccessibility,
        appTheme,
    };
};


