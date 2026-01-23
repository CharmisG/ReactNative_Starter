import i18n from '../Localization/Localize';
import { FeatureFlags } from '../config/AppConfig';
import NumberFormatter from './NumberFormatter';

/**
 * Maps language codes to measurement systems
 * 'metric' = metric system (meters, kilograms, celsius)
 * 'imperial' = imperial system (feet, pounds, fahrenheit)
 */
const LANGUAGE_TO_MEASUREMENT_SYSTEM: Record<string, 'metric' | 'imperial'> = {
  en: 'imperial',  // US uses imperial
  es: 'metric',    // Spain uses metric
  // Add more mappings as needed:
  // fr: 'metric',
  // de: 'metric',
  // uk: 'imperial',  // UK uses imperial for some measurements
  // etc.
};

/**
 * Gets the measurement system for the current language
 */
const getMeasurementSystem = (): 'metric' | 'imperial' => {
  const currentLanguage = i18n.language || FeatureFlags.localization.defaultLanguage || 'en';
  return LANGUAGE_TO_MEASUREMENT_SYSTEM[currentLanguage] || 'metric';
};

/**
 * Unit and Measurement Formatting Utility
 * Provides localized unit formatting with automatic system conversion
 */
export class UnitFormatter {
  /**
   * Format a value with a unit (with error handling for unsupported units)
   * @param value - Numeric value
   * @param unit - Unit identifier (e.g., 'meter', 'kilogram', 'celsius')
   * @param unitDisplay - Display style
   * @returns Formatted string with unit
   */
  static formatWithUnit(
    value: number,
    unit: string,
    unitDisplay: 'short' | 'long' | 'narrow' = 'short'
  ): string {
    try {
      return NumberFormatter.formatWithUnit(value, unit, unitDisplay);
    } catch (error) {
      // Fallback for unsupported units - format number and append unit manually
      const formattedNumber = NumberFormatter.format(value, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      const unitSymbol = this.getUnitSymbol(unit, unitDisplay);
      return `${formattedNumber} ${unitSymbol}`;
    }
  }

  /**
   * Get unit symbol for fallback formatting
   */
  private static getUnitSymbol(unit: string, display: 'short' | 'long' | 'narrow'): string {
    const symbols: Record<string, { short: string; long: string; narrow: string }> = {
      'foot': { short: 'ft', long: 'feet', narrow: 'ft' },
      'fahrenheit': { short: '°F', long: 'Fahrenheit', narrow: '°F' },
    };
    // Default fallback
    return unit;
  }

  /**
   * Format distance (automatically converts between metric and imperial)
   * @param meters - Distance in meters
   * @param precision - Decimal places (default: 1)
   * @returns Formatted distance string
   */
  static formatDistance(meters: number, precision: number = 1): string {
    const system = getMeasurementSystem();

    if (system === 'imperial') {
      // Convert meters to feet
      const feet = meters * 3.28084;
      if (feet < 5280) {
        // Less than a mile, show in feet
        return this.formatWithUnit(feet, 'foot', 'short');
      } else {
        // Show in miles
        const miles = feet / 5280;
        return this.formatWithUnit(miles, 'mile', 'short');
      }
    } else {
      // Metric system
      if (meters < 1000) {
        return this.formatWithUnit(meters, 'meter', 'short');
      } else {
        const kilometers = meters / 1000;
        return this.formatWithUnit(kilometers, 'kilometer', 'short');
      }
    }
  }


  /**
   * Format temperature (automatically converts between celsius and fahrenheit)
   * @param celsius - Temperature in Celsius
   * @param precision - Decimal places (default: 0)
   * @returns Formatted temperature string
   */
  static formatTemperature(celsius: number, precision: number = 0): string {
    const system = getMeasurementSystem();

    if (system === 'imperial') {
      // Convert to Fahrenheit
      const fahrenheit = (celsius * 9 / 5) + 32;
      return this.formatWithUnit(fahrenheit, 'fahrenheit', 'short');
    } else {
      // Metric system uses Celsius
      return this.formatWithUnit(celsius, 'celsius', 'short');
    }
  }

  /**
   * Get the current measurement system
   * @returns 'metric' or 'imperial'
   */
  static getMeasurementSystem(): 'metric' | 'imperial' {
    return getMeasurementSystem();
  }

  /**
   * Convert value between measurement systems
   */
  static convert = {
    // Distance conversions
    metersToFeet: (meters: number) => meters * 3.28084,
    feetToMeters: (feet: number) => feet / 3.28084,
    kilometersToMiles: (km: number) => km * 0.621371,
    milesToKilometers: (miles: number) => miles / 0.621371,

    // Temperature conversions
    celsiusToFahrenheit: (celsius: number) => (celsius * 9 / 5) + 32,
    fahrenheitToCelsius: (fahrenheit: number) => (fahrenheit - 32) * 5 / 9,

  };
}

/**
 * Convenience functions
 */
export const formatDistance = (meters: number, precision: number = 1): string =>
  UnitFormatter.formatDistance(meters, precision);

export const formatTemperature = (celsius: number, precision: number = 0): string =>
  UnitFormatter.formatTemperature(celsius, precision);


export default UnitFormatter;

