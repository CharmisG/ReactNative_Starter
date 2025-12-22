# Units & Measurements Localization Guide

This guide explains how to use localized units and measurements formatting in your React Native app.

## Overview

The app now includes a `UnitFormatter` utility that automatically formats measurements based on the current app language and measurement system (metric or imperial). The formatter uses the native `Intl.NumberFormat` API with unit support, providing proper locale-aware formatting.

## Features

- ✅ Automatic measurement system detection (metric/imperial)
- ✅ Automatic unit conversion based on language
- ✅ Support for distance, weight, temperature, speed, volume, area, energy, duration
- ✅ Built-in conversion utilities
- ✅ No additional dependencies required (uses native Intl API)
- ✅ TypeScript support

## Measurement Systems

The formatter automatically selects the measurement system based on language:

- **English (en-US)**: Imperial system (feet, pounds, Fahrenheit, mph)
- **Spanish (es-ES)**: Metric system (meters, kilograms, Celsius, km/h)
- **Other languages**: Default to metric (configurable)

## Quick Start

### Basic Usage

```typescript
import UnitFormatter from '../utils/UnitFormatter';

// Format distance (automatically converts)
const distance = UnitFormatter.formatDistance(1500); // 1500 meters
// English: "4,921 ft" or "0.9 mi"
// Spanish: "1.5 km"

// Format weight (automatically converts)
const weight = UnitFormatter.formatWeight(75); // 75 kg
// English: "165 lb"
// Spanish: "75 kg"

// Format temperature (automatically converts)
const temp = UnitFormatter.formatTemperature(25); // 25°C
// English: "77°F"
// Spanish: "25°C"
```

## API Reference

### UnitFormatter.formatDistance()
Format distance with automatic conversion.

```typescript
UnitFormatter.formatDistance(meters: number, precision: number = 1): string
```

**Examples:**
```typescript
UnitFormatter.formatDistance(500);    // 500 meters
// English: "1,640 ft"
// Spanish: "500 m"

UnitFormatter.formatDistance(2000);   // 2000 meters
// English: "1.2 mi"
// Spanish: "2 km"
```

### UnitFormatter.formatWeight()
Format weight with automatic conversion.

```typescript
UnitFormatter.formatWeight(kilograms: number, precision: number = 1): string
```

**Examples:**
```typescript
UnitFormatter.formatWeight(75);        // 75 kg
// English: "165 lb"
// Spanish: "75 kg"

UnitFormatter.formatWeight(0.5);      // 0.5 kg
// English: "1.1 lb"
// Spanish: "500 g"
```

### UnitFormatter.formatTemperature()
Format temperature with automatic conversion.

```typescript
UnitFormatter.formatTemperature(celsius: number, precision: number = 0): string
```

**Examples:**
```typescript
UnitFormatter.formatTemperature(25);  // 25°C
// English: "77°F"
// Spanish: "25°C"

UnitFormatter.formatTemperature(0);   // 0°C
// English: "32°F"
// Spanish: "0°C"
```

### UnitFormatter.formatSpeed()
Format speed with automatic conversion.

```typescript
UnitFormatter.formatSpeed(metersPerSecond: number, precision: number = 1): string
```

**Examples:**
```typescript
UnitFormatter.formatSpeed(50);        // 50 m/s
// English: "112 mph"
// Spanish: "180 km/h"
```

### UnitFormatter.formatVolume()
Format volume with automatic conversion.

```typescript
UnitFormatter.formatVolume(liters: number, precision: number = 2): string
```

**Examples:**
```typescript
UnitFormatter.formatVolume(2.5);      // 2.5 liters
// English: "0.66 gal" or "84 fl oz"
// Spanish: "2.5 L"

UnitFormatter.formatVolume(0.5);      // 0.5 liters
// English: "17 fl oz"
// Spanish: "500 mL"
```

### UnitFormatter.formatArea()
Format area with automatic conversion.

```typescript
UnitFormatter.formatArea(squareMeters: number, precision: number = 1): string
```

**Examples:**
```typescript
UnitFormatter.formatArea(500);        // 500 m²
// English: "5,382 sq ft"
// Spanish: "500 m²"

UnitFormatter.formatArea(50000);       // 50,000 m²
// English: "12.4 acres"
// Spanish: "5 ha"
```

### UnitFormatter.formatEnergy()
Format energy (calories).

```typescript
UnitFormatter.formatEnergy(calories: number, precision: number = 0): string
```

**Examples:**
```typescript
UnitFormatter.formatEnergy(500);      // 500 calories
// English: "500 cal"
// Spanish: "500 cal"

UnitFormatter.formatEnergy(2500);     // 2500 calories
// English: "2.5 kcal"
// Spanish: "2.5 kcal"
```

### UnitFormatter.formatDuration()
Format time duration.

```typescript
UnitFormatter.formatDuration(seconds: number): string
```

**Examples:**
```typescript
UnitFormatter.formatDuration(45);     // 45 seconds
// English: "45 sec"
// Spanish: "45 s"

UnitFormatter.formatDuration(3665);    // 1 hour 1 minute 5 seconds
// English: "1 hr"
// Spanish: "1 h"
```

### UnitFormatter.formatWithUnit()
Format any value with a unit (generic method).

```typescript
UnitFormatter.formatWithUnit(
  value: number,
  unit: string,
  unitDisplay: 'short' | 'long' | 'narrow' = 'short'
): string
```

**Supported units:**
- Distance: `meter`, `kilometer`, `foot`, `mile`
- Weight: `kilogram`, `gram`, `pound`, `ounce`
- Temperature: `celsius`, `fahrenheit`
- Speed: `kilometer-per-hour`, `mile-per-hour`
- Volume: `liter`, `milliliter`, `gallon`, `fluid-ounce`
- Area: `square-meter`, `square-foot`, `acre`, `hectare`
- Energy: `calorie`, `kilocalorie`
- Time: `second`, `minute`, `hour`, `day`

## Conversion Utilities

The formatter includes built-in conversion functions:

```typescript
import UnitFormatter from '../utils/UnitFormatter';

// Distance conversions
const feet = UnitFormatter.convert.metersToFeet(100);      // 328.084 ft
const meters = UnitFormatter.convert.feetToMeters(328);    // 100 m
const miles = UnitFormatter.convert.kilometersToMiles(1.6); // 1 mi
const km = UnitFormatter.convert.milesToKilometers(1);     // 1.6 km

// Weight conversions
const pounds = UnitFormatter.convert.kilogramsToPounds(75); // 165.35 lb
const kg = UnitFormatter.convert.poundsToKilograms(165);   // 75 kg

// Temperature conversions
const fahrenheit = UnitFormatter.convert.celsiusToFahrenheit(25); // 77°F
const celsius = UnitFormatter.convert.fahrenheitToCelsius(77);    // 25°C

// Volume conversions
const gallons = UnitFormatter.convert.litersToGallons(3.79); // 1 gal
const liters = UnitFormatter.convert.gallonsToLiters(1);    // 3.79 L

// Speed conversions
const mph = UnitFormatter.convert.kmhToMph(100);  // 62.1 mph
const kmh = UnitFormatter.convert.mphToKmh(60);   // 96.6 km/h
```

## React Component Example

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import UnitFormatter from '../utils/UnitFormatter';

const WeatherCard = ({ temperature, distance, speed }) => {
  return (
    <View>
      <Text>Temperature: {UnitFormatter.formatTemperature(temperature)}</Text>
      <Text>Distance: {UnitFormatter.formatDistance(distance)}</Text>
      <Text>Wind Speed: {UnitFormatter.formatSpeed(speed)}</Text>
    </View>
  );
};
```

## Common Use Cases

### Fitness App
```typescript
// Display user stats
const distance = UnitFormatter.formatDistance(userRunDistance);
const weight = UnitFormatter.formatWeight(userWeight);
const energy = UnitFormatter.formatEnergy(caloriesBurned);
const duration = UnitFormatter.formatDuration(workoutDuration);
```

### Weather App
```typescript
// Display weather data
const temp = UnitFormatter.formatTemperature(currentTemp);
const windSpeed = UnitFormatter.formatSpeed(windSpeedMps);
const visibility = UnitFormatter.formatDistance(visibilityMeters);
```

### Shopping App
```typescript
// Display product dimensions
const weight = UnitFormatter.formatWeight(productWeight);
const volume = UnitFormatter.formatVolume(productVolume);
const area = UnitFormatter.formatArea(roomSize);
```

### Health App
```typescript
// Display health metrics
const weight = UnitFormatter.formatWeight(userWeight);
const energy = UnitFormatter.formatEnergy(dailyCalories);
const duration = UnitFormatter.formatDuration(sleepDuration);
```

## Configuration

### Change Measurement System per Language

Update `LANGUAGE_TO_MEASUREMENT_SYSTEM` in `src/utils/UnitFormatter.ts`:

```typescript
const LANGUAGE_TO_MEASUREMENT_SYSTEM: Record<string, 'metric' | 'imperial'> = {
  en: 'imperial',  // US uses imperial
  es: 'metric',    // Spain uses metric
  'en-GB': 'metric',  // UK uses metric for most measurements
  // Add more as needed
};
```

## Settings Screen Example

The units example is already implemented in SettingsScreen. To enable/disable:

```typescript
// In AppConfig.ts
settingsScreen: {
    showUnitsExample: true,  // Set to false to hide
},
```

## Best Practices

1. **Always use base units** - Pass values in metric base units (meters, kg, Celsius)
2. **Let the formatter convert** - Don't manually convert, let UnitFormatter handle it
3. **Use appropriate precision** - Adjust precision based on the measurement type
4. **Cache formatted values** - Use `useMemo` for expensive formatting operations
5. **Handle edge cases** - Check for null/undefined values before formatting

## Notes

- The formatter automatically converts between metric and imperial based on language
- All conversions use standard conversion factors
- Temperature conversion uses the standard formula: F = (C × 9/5) + 32
- The formatter respects locale-specific number formatting (decimal separators, thousand separators)
- Unit names are automatically localized by the Intl API

## See Also

- `src/utils/UnitFormatter.ts` - Full implementation
- `src/components/settings/UnitsExampleCard.tsx` - Example component
- `src/utils/NumberFormatter.ts` - Number formatting utilities
- `src/utils/DateFormatter.ts` - Date/time formatting utilities

