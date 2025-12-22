import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import ToastItem from './Toast';
import { windowWidth } from '../styles/Dimens';
import Colors from '../styles/Colors';

type ToastOptions = {
    type?: 'info' | 'success' | 'error' | 'warning';
    /** Optional title shown in bold. If omitted, a default is derived from `type`. */
    title?: string;
    /** Main body text (keeps backwards compatibility with `text`). */
    text?: string;
    duration?: number; // ms, 0 to persist until manually closed
    imageSource?: ImageSourcePropType;
    showSpinner?: boolean;
};

type ToastContextType = {
    showToast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

// exported global function to call from anywhere after provider mounts
export let showToast: (opts: ToastOptions) => void = () => { };

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Array<{ id: number; opts: ToastOptions }>>([]);
    const idRef = useRef(0);

    const removeToast = useCallback((id: number) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const _showToast = useCallback((opts: ToastOptions) => {
        const id = ++idRef.current;
        setToasts((t) => [{ id, opts }, ...t]);
        if (opts.duration !== 0) {
            const duration = opts.duration ?? 3000;
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    // expose global helper
    useEffect(() => {
        showToast = _showToast;
        return () => {
            showToast = () => { };
        };
    }, [_showToast]);

    return (
        <ToastContext.Provider value={{ showToast: _showToast }}>
            {children}
            <View pointerEvents="box-none" style={styles.container}>
                {toasts.map((t) => (
                    <ToastItem
                        key={t.id}
                        title={t.opts.title}
                        text={t.opts.text ?? ''}
                        type={(t.opts.type as any) ?? 'info'}
                        onClose={() => removeToast(t.id)}
                        imageSource={t.opts.imageSource}
                        showSpinner={t.opts.showSpinner}
                    />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        left: '8%',
        width: '85%',
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: 12,
    },
});

export default ToastContext;
