import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Translate from '../../hooks/Translate';
import Colors from '../../styles/Colors';

// Constants
const MIN_FONT_SCALE = 0.85;
const MAX_FONT_SCALE = 2.0;
const MIN_TOUCH_TARGET = 44;
const MAX_TOUCH_TARGET = 72;
const TOUCH_TARGET_STEP = 4;
const DEFAULT_TOUCH_TARGET = 48;

// Types
type Styles = ReturnType<typeof import('./AccessibilityStyles').createAccessibilityStyles>;

// Status Row Component
interface StatusRowProps {
    label: string;
    value: boolean;
    styles: Styles;
}

export const StatusRow = memo<StatusRowProps>(({ label, value, styles }) => {
    const statusText = useMemo(() => (value ? Translate('Enabled') : Translate('Disabled')), [value]);

    return (
        <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Text style={[styles.settingValue, value && styles.enabledText]}>
                {statusText}
            </Text>
        </View>
    );
});
StatusRow.displayName = 'StatusRow';

// Section Component
interface SectionProps {
    title: string;
    children: React.ReactNode;
    styles: Styles;
}

export const Section = memo<SectionProps>(({ title, children, styles }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
));
Section.displayName = 'Section';

// Font Scale Controls Component
interface FontScaleControlsProps {
    fontScale: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onReset: () => void;
    styles: Styles;
}

export const FontScaleControls = memo<FontScaleControlsProps>(({ fontScale, onIncrease, onDecrease, onReset, styles }) => {
    const isMinDisabled = useMemo(() => fontScale <= MIN_FONT_SCALE, [fontScale]);
    const isMaxDisabled = useMemo(() => fontScale >= MAX_FONT_SCALE, [fontScale]);
    const fontScaleText = useMemo(() => `${fontScale.toFixed(1)}x`, [fontScale]);

    return (
        <>
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{Translate('Font Scale')}</Text>
                <Text style={styles.settingValue}>{fontScaleText}</Text>
            </View>
            <View style={styles.controlRow}>
                <TouchableOpacity
                    style={[styles.controlButton, isMinDisabled && styles.controlButtonDisabled]}
                    onPress={onDecrease}
                    disabled={isMinDisabled}
                    accessibilityLabel={Translate('Decrease font size')}
                    accessibilityRole="button"
                >
                    <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={onReset}
                    accessibilityLabel={Translate('Reset font size')}
                    accessibilityRole="button"
                >
                    <Text style={styles.resetButtonText}>{Translate('Reset')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.controlButton, isMaxDisabled && styles.controlButtonDisabled]}
                    onPress={onIncrease}
                    disabled={isMaxDisabled}
                    accessibilityLabel={Translate('Increase font size')}
                    accessibilityRole="button"
                >
                    <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </>
    );
});
FontScaleControls.displayName = 'FontScaleControls';

// High Contrast Toggle Component
interface HighContrastToggleProps {
    enabled: boolean;
    onToggle: () => void;
    styles: Styles;
}

export const HighContrastToggle = memo<HighContrastToggleProps>(({ enabled, onToggle, styles }) => (
    <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{Translate('High Contrast Mode')}</Text>
        <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ false: Colors.grey, true: Colors.primary }}
            thumbColor={Colors.white}
            accessibilityLabel={Translate('Toggle high contrast mode')}
        />
    </View>
));
HighContrastToggle.displayName = 'HighContrastToggle';

// Touch Target Controls Component
interface TouchTargetControlsProps {
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
    onReset: () => void;
    styles: Styles;
}

export const TouchTargetControls = memo<TouchTargetControlsProps>(({ value, onDecrease, onIncrease, onReset, styles }) => {
    const isMinDisabled = useMemo(() => value <= MIN_TOUCH_TARGET, [value]);
    const isMaxDisabled = useMemo(() => value >= MAX_TOUCH_TARGET, [value]);
    const valueText = useMemo(() => `${value} dp`, [value]);

    return (
        <>
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{Translate('Minimum Size')}</Text>
                <Text style={styles.settingValue}>{valueText}</Text>
            </View>
            <View style={styles.controlRow}>
                <TouchableOpacity
                    style={[styles.controlButton, isMinDisabled && styles.controlButtonDisabled]}
                    onPress={onDecrease}
                    disabled={isMinDisabled}
                    accessibilityLabel={Translate('Decrease touch target size')}
                    accessibilityRole="button"
                >
                    <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={onReset}
                    accessibilityLabel={Translate('Reset touch target size')}
                    accessibilityRole="button"
                >
                    <Text style={styles.resetButtonText}>{Translate('Reset')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.controlButton, isMaxDisabled && styles.controlButtonDisabled]}
                    onPress={onIncrease}
                    disabled={isMaxDisabled}
                    accessibilityLabel={Translate('Increase touch target size')}
                    accessibilityRole="button"
                >
                    <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </>
    );
});
TouchTargetControls.displayName = 'TouchTargetControls';
// Export constants for use in screen
export { MIN_FONT_SCALE, MAX_FONT_SCALE, MIN_TOUCH_TARGET, MAX_TOUCH_TARGET, TOUCH_TARGET_STEP, DEFAULT_TOUCH_TARGET };

