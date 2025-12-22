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
        () => [
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
            {
                title: Translate('Logout'),
                icon: Images.logout,
                action: handleLogout,
            },
        ],
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
        const loadData = async () => {
            try {
                await dispatch(HomeSliceActions.getSampleDataAction());
            } catch (error) {
                errorHandler.handleError(error, { source: 'DashboardScreen', action: 'initial_load' });
            }
        };
        loadData();
    }, [dispatch]);

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

