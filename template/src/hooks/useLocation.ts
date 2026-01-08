import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { FeatureFlags } from '../config/AppConfig';
import Translate from './Translate';

export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
    timestamp: number;
}

export const useLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const isMapsEnabled = FeatureFlags.maps?.enabled ?? false;
    const trackLocation = FeatureFlags.maps?.trackLocation ?? true;
    const updateInterval = FeatureFlags.maps?.updateInterval ?? 1000;

    const checkLocationPermission = useCallback(async (): Promise<boolean> => {
        if (!isMapsEnabled || !FeatureFlags.maps?.requestPermissions) {
            return false;
        }

        if (Platform.OS === 'android') {
            try {
                const fineLocation = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                const coarseLocation = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                );
                return fineLocation || coarseLocation;
            } catch (error) {
                console.error('Location permission check failed:', error);
                return false;
            }
        }

        // iOS permissions are handled via Info.plist
        return true;
    }, [isMapsEnabled]);

    const requestLocationPermission = useCallback(async (): Promise<boolean> => {
        if (!isMapsEnabled || !FeatureFlags.maps?.requestPermissions) {
            Alert.alert('', Translate('Maps feature is disabled'));
            return false;
        }

        if (Platform.OS === 'android') {
            try {
                const hasPermission = await checkLocationPermission();
                if (hasPermission) {
                    setHasPermission(true);
                    return true;
                }

                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                const fineLocationGranted =
                    granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
                    PermissionsAndroid.RESULTS.GRANTED;
                const coarseLocationGranted =
                    granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
                    PermissionsAndroid.RESULTS.GRANTED;

                const permissionGranted = fineLocationGranted || coarseLocationGranted;
                setHasPermission(permissionGranted);

                if (!permissionGranted) {
                    if (
                        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
                        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                    ) {
                        Alert.alert(
                            Translate('Permission Denied'),
                            Translate('Location permission has been permanently denied. Please enable it in app settings.'),
                        );
                    } else {
                        Alert.alert(
                            Translate('Permission Denied'),
                            Translate('Location permission is required to show your location on the map.'),
                        );
                    }
                }

                return permissionGranted;
            } catch (error) {
                console.error('Location permission request failed:', error);
                setHasPermission(false);
                Alert.alert(Translate('Error'), Translate('Failed to request location permission'));
                return false;
            }
        }

        // iOS - permissions are requested automatically when location is accessed
        setHasPermission(true);
        return true;
    }, [isMapsEnabled, checkLocationPermission]);

    const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
        if (!isMapsEnabled) {
            setError(Translate('Maps feature is disabled'));
            return null;
        }

        const hasPermission = await checkLocationPermission();
        if (!hasPermission) {
            const granted = await requestLocationPermission();
            if (!granted) {
                setError(Translate('Location permission is required'));
                return null;
            }
        }

        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const locationData: LocationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp,
                    };
                    setLocation(locationData);
                    setError(null);
                    resolve(locationData);
                },
                (error) => {
                    console.error('Get current location error:', error);
                    const errorMessage =
                        error.code === 1
                            ? Translate('Location permission denied')
                            : error.code === 2
                                ? Translate('Location unavailable')
                                : Translate('Failed to get location');
                    setError(errorMessage);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                },
            );
        });
    }, [isMapsEnabled, checkLocationPermission, requestLocationPermission]);

    const startTracking = useCallback(async () => {
        if (!isMapsEnabled || !trackLocation) {
            Alert.alert('', Translate('Location tracking is disabled'));
            return;
        }

        const hasPermission = await checkLocationPermission();
        if (!hasPermission) {
            const granted = await requestLocationPermission();
            if (!granted) {
                return;
            }
        }

        // Stop any existing tracking
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
        }

        watchIdRef.current = Geolocation.watchPosition(
            (position) => {
                const locationData: LocationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    timestamp: position.timestamp,
                };
                setLocation(locationData);
                setError(null);
            },
            (error) => {
                console.error('Watch position error:', error);
                const errorMessage =
                    error.code === 1
                        ? Translate('Location permission denied')
                        : error.code === 2
                            ? Translate('Location unavailable')
                            : Translate('Failed to track location');
                setError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                interval: updateInterval
            },
        );
        setIsTracking(true);
    }, [isMapsEnabled, trackLocation, checkLocationPermission, requestLocationPermission, updateInterval]);

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    }, []);

    useEffect(() => {
        const checkPermission = async () => {
            if (isMapsEnabled && FeatureFlags.maps?.requestPermissions) {
                const hasPermission = await checkLocationPermission();
                setHasPermission(hasPermission);
            } else {
                setHasPermission(false);
            }
        };
        checkPermission();
    }, [isMapsEnabled, checkLocationPermission]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    return {
        location,
        hasPermission,
        isTracking,
        error,
        isMapsEnabled,
        getCurrentLocation,
        startTracking,
        stopTracking,
        requestLocationPermission,
    };
};

