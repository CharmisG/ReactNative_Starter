import React, { useMemo, useEffect, useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { RootState } from '../redux/store';
import Navbar from '../components/Navbar';
import { useLocation } from '../hooks/useLocation';
import { createMapsStyles } from '../components/maps/MapsStyles';
import Translate from '../hooks/Translate';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { FeatureFlags } from '../config/AppConfig';
import Colors from '../styles/Colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Maps'>;

// Constants
const DEFAULT_REGION: Region = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const DELTA_VALUES = {
    latitude: 0.0922,
    longitude: 0.0421,
} as const;

// Memoized sub-components
interface LoadingOverlayProps {
    styles: ReturnType<typeof createMapsStyles>;
}

const LoadingOverlay = memo<LoadingOverlayProps>(({ styles }) => (
    <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{Translate('Getting location...')}</Text>
    </View>
));

LoadingOverlay.displayName = 'LoadingOverlay';

interface LocationInfoProps {
    location: NonNullable<ReturnType<typeof useLocation>['location']>;
    isTracking: boolean;
    styles: ReturnType<typeof createMapsStyles>;
}

const LocationInfo = memo<LocationInfoProps>(({ location, isTracking, styles }) => {
    const latitude = useMemo(() => location.latitude.toFixed(6), [location.latitude]);
    const longitude = useMemo(() => location.longitude.toFixed(6), [location.longitude]);
    const accuracy = useMemo(() => location.accuracy?.toFixed(2), [location.accuracy]);

    return (
        <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{Translate('Latitude')}:</Text>
                <Text style={styles.infoValue}>{latitude}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{Translate('Longitude')}:</Text>
                <Text style={styles.infoValue}>{longitude}</Text>
            </View>
            {location.accuracy !== null && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{Translate('Accuracy')}:</Text>
                    <Text style={styles.infoValue}>{accuracy} m</Text>
                </View>
            )}
            {isTracking && (
                <View style={styles.trackingIndicator}>
                    <View style={styles.trackingDot} />
                    <Text style={styles.trackingText}>{Translate('Tracking')}</Text>
                </View>
            )}
        </View>
    );
});

LocationInfo.displayName = 'LocationInfo';

interface TrackingButtonProps {
    isTracking: boolean;
    onToggle: () => void;
    styles: ReturnType<typeof createMapsStyles>;
}

const TrackingButton = memo<TrackingButtonProps>(({ isTracking, onToggle, styles }) => {
    const buttonText = useMemo(
        () => (isTracking ? Translate('Stop Tracking') : Translate('Start Tracking')),
        [isTracking]
    );

    return (
        <TouchableOpacity
            style={[styles.trackingButton, isTracking && styles.trackingButtonActive]}
            onPress={onToggle}
            activeOpacity={0.8}
        >
            <Text style={styles.trackingButtonText}>{buttonText}</Text>
        </TouchableOpacity>
    );
});
TrackingButton.displayName = 'TrackingButton';

const MapsScreen = ({ navigation }: Props) => {
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const styles = useMemo(() => createMapsStyles(appTheme), [appTheme]);
    const {
        location,
        hasPermission,
        isTracking,
        error,
        isMapsEnabled,
        getCurrentLocation,
        startTracking,
        stopTracking,
        requestLocationPermission,
    } = useLocation();

    // Memoize FeatureFlags checks
    const mapsConfig = useMemo(() => FeatureFlags.maps, []);
    const showCurrentLocation = useMemo(() => mapsConfig?.showCurrentLocation ?? true, [mapsConfig]);
    const showLocationInfo = useMemo(() => mapsConfig?.showLocationInfo ?? true, [mapsConfig]);
    const trackLocationEnabled = useMemo(() => mapsConfig?.trackLocation ?? true, [mapsConfig]);

    const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);

    // Update map region when location changes
    useEffect(() => {
        if (isMapsEnabled && location) {
            setMapRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: DELTA_VALUES.latitude,
                longitudeDelta: DELTA_VALUES.longitude,
            });
        }
    }, [location, isMapsEnabled]);

    // Auto-start tracking if enabled
    useEffect(() => {
        if (isMapsEnabled && trackLocationEnabled && location) {
            startTracking();
        }
        return () => {
            stopTracking();
        };
    }, [isMapsEnabled, trackLocationEnabled, location, startTracking, stopTracking]);

    // Memoized handlers
    const handleRequestPermission = useCallback(async () => {
        const granted = await requestLocationPermission();
        if (granted) {
            await getCurrentLocation();
            if (trackLocationEnabled) {
                startTracking();
            }
        }
    }, [requestLocationPermission, getCurrentLocation, trackLocationEnabled, startTracking]);

    const handleToggleTracking = useCallback(() => {
        if (isTracking) {
            stopTracking();
        } else {
            startTracking();
        }
    }, [isTracking, startTracking, stopTracking]);

    const handleRegionChangeComplete = useCallback((region: Region) => {
        setMapRegion(region);
    }, []);

    // Memoize marker coordinate
    const markerCoordinate = useMemo(
        () =>
            location
                ? {
                    latitude: location.latitude,
                    longitude: location.longitude,
                }
                : null,
        [location]
    );

    // Memoize marker description
    const markerDescription = useMemo(
        () => (location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : ''),
        [location]
    );

    // Memoize MapView props
    const mapViewProps = useMemo(
        () => ({
            provider: PROVIDER_DEFAULT,
            style: styles.map,
            region: mapRegion,
            initialRegion: mapRegion,
            showsUserLocation: false,
            followsUserLocation: false,
            showsMyLocationButton: false,
            onRegionChangeComplete: handleRegionChangeComplete,
            mapType: 'standard' as const,
            loadingEnabled: true,
            loadingIndicatorColor: Colors.primary,
        }),
        [styles.map, mapRegion, handleRegionChangeComplete]
    );

    // Memoize screen title
    const screenTitle = useMemo(() => Translate('Maps'), []);
    const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

    // Early returns for disabled/error states
    if (!isMapsEnabled) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{Translate('Maps feature is disabled')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (hasPermission === false) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {Translate('Location permission is required to show your location on the map')}
                    </Text>
                    <TouchableOpacity
                        style={styles.permissionButton}
                        onPress={handleRequestPermission}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.permissionButtonText}>
                            {Translate('Grant Permission')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (hasPermission === null) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{Translate('Requesting location permission...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Memoize marker title
    const markerTitle = useMemo(() => Translate('Current Location'), []);

    return (
        <SafeAreaView style={styles.container}>
            <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
            <View style={styles.mapContainer}>
                <MapView {...mapViewProps}>
                    {showCurrentLocation && markerCoordinate && (
                        <Marker
                            coordinate={markerCoordinate}
                            title={markerTitle}
                            description={markerDescription}
                        />
                    )}
                </MapView>
                {!location && <LoadingOverlay styles={styles} />}
            </View>

            {showLocationInfo && location && (
                <LocationInfo location={location} isTracking={isTracking} styles={styles} />
            )}

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{error}</Text>
                </View>
            )}

            {trackLocationEnabled && (
                <TrackingButton isTracking={isTracking} onToggle={handleToggleTracking} styles={styles} />
            )}
        </SafeAreaView>
    );
};

export default MapsScreen;

