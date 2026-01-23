import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { HomeSliceActions } from '../redux/slices/HomeSlice';
import { AuthContext } from '../hooks/AuthContext';
import analytics from '@react-native-firebase/analytics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import { Animated, Easing } from 'react-native';
import Translate from './Translate';
import Images from '../utils/Images';
import { errorHandler } from '../utils/errors';
import { FeatureFlags } from '../config/AppConfig';

export const useDashboardScreen = (navigation: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const { sampleData, isLoading, error } = useSelector((state: RootState) => state.Home);
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const { loginType, setLoginType } = useContext(AuthContext);

    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const scale = useRef(new Animated.Value(0)).current;

    const analyticsTest = useCallback(async () => {
        await analytics().logScreenView({
            screen_name: 'Settings',
            screen_class: 'Settings',
        });
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            if (loginType === 'google') {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            } else if (loginType === 'facebook') {
                await auth().signOut();
            } else if (loginType === 'apple') {
                await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGOUT,
                });
            }
            setLoginType(null);
            navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            errorHandler.handleError(error, { source: 'DashboardScreen', action: 'logout' });
        }
    }, [loginType, setLoginType, navigation]);

    const menuOptions = useMemo(
        () => {
            const options = [
                {
                    title: Translate('Settings'),
                    icon: Images.settings,
                    action: () => {
                        analyticsTest();
                        navigation.getParent()?.navigate('Settings');
                    },
                },
                {
                    title: Translate('TextEditor'),
                    icon: Images.settings,
                    action: () => {
                        navigation.getParent()?.navigate('TextEditor');
                    },
                },
            ];

            // Add QR Scanner option
            options.push({
                title: Translate('QR Scanner'),
                icon: Images.settings, // Using settings icon as placeholder, you can add a QR icon to Images.ts
                action: () => {
                    navigation.getParent()?.navigate('QRScanner');
                },
            });

            // Add Maps option if enabled via FeatureFlags
            if (FeatureFlags.maps?.enabled && FeatureFlags.maps?.showDashboardIcon) {
                options.push({
                    title: Translate('Maps'),
                    icon: Images.settings, // Using settings icon as placeholder, you can add a maps icon to Images.ts
                    action: () => {
                        navigation.getParent()?.navigate('Maps');
                    },
                });
            }

            // Add Media Viewer option if enabled via FeatureFlags
            if (FeatureFlags.mediaViewer?.enabled && FeatureFlags.mediaViewer?.showDashboardIcon) {
                options.push({
                    title: Translate('Media Viewer'),
                    icon: Images.settings, // Using settings icon as placeholder
                    action: () => {
                        navigation.getParent()?.navigate('MediaViewer');
                    },
                });
            }

            // Add Accessibility option if enabled via FeatureFlags
            if (FeatureFlags.accessibility?.enabled && FeatureFlags.accessibility?.showDashboardIcon) {
                options.push({
                    title: Translate('Accessibility'),
                    icon: Images.settings, // Using settings icon as placeholder
                    action: () => {
                        navigation.getParent()?.navigate('Accessibility');
                    },
                });
            }

            options.push({
                title: Translate('Logout'),
                icon: Images.logout,
                action: handleLogout,
            });

            return options;
        },
        [analyticsTest, handleLogout, navigation]
    );

    const resizeBox = useCallback((to: number) => {
        if (to === 1) setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 150,
            easing: Easing.linear,
        }).start(() => {
            if (to === 0) setVisible(false);
        });
    }, [scale]);

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await dispatch(HomeSliceActions.getSampleDataAction());
        } catch (err) {
            errorHandler.handleError(err, { source: 'DashboardScreen', action: 'refresh' });
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    const handleOpenModal = useCallback(() => {
        setModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleNavigateToScreenTwo = useCallback(() => {
        setModalVisible(false);
        navigation.getParent()?.navigate('ScreenTwo');
    }, [navigation]);

    useEffect(() => {
        // Load data on mount
        dispatch(HomeSliceActions.getSampleDataAction());
    }, [dispatch]);

    // Log errors when they occur in Redux state
    useEffect(() => {
        if (error) {
            errorHandler.handleError(
                new Error(error),
                { source: 'DashboardScreen', action: 'initial_load' }
            );
        }
    }, [error]);

    const filteredOptions = useMemo(() => {
        return menuOptions.filter(
            (op) => !(loginType == null && op.title === Translate('Logout'))
        );
    }, [menuOptions, loginType]);

    return {
        sampleData,
        isLoading,
        error,
        appTheme,
        visible,
        modalVisible,
        refreshing,
        scale,
        filteredOptions,
        resizeBox,
        onRefresh,
        handleOpenModal,
        handleCloseModal,
        handleNavigateToScreenTwo,
    };
};

