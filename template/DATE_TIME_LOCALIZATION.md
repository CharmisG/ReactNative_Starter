# Date and Time Localization Guide

This guide explains how to use localized date and time formatting in your React Native app.

## Overview

The app now includes a `DateFormatter` utility that automatically formats dates and times based on the current app language (set via i18next). The formatter uses the native `Intl.DateTimeFormat` API, which provides proper locale-aware formatting without requiring additional dependencies.

## Features

- ✅ Automatic locale detection based on current i18n language
- ✅ Support for multiple date/time formats
- ✅ Relative time formatting (e.g., "2 hours ago")
- ✅ Custom formatting patterns
- ✅ No additional dependencies required (uses native Intl API)
- ✅ TypeScript support

## Quick Start

### Basic Usage

```typescript
import DateFormatter from '../utils/DateFormatter';

// Format current date
const date = DateFormatter.formatDate(new Date(), 'medium');
// English: "Dec 25, 2023"
// Spanish: "25 dic 2023"

// Format current time
const time = DateFormatter.formatTime(new Date(), 'short', true);
// English: "3:45 PM"
// Spanish: "15:45"

// Format date and time together
const dateTime = DateFormatter.formatDateTime(new Date(), 'medium', 'short', true);
// English: "Dec 25, 2023, 3:45 PM"
// Spanish: "25 dic 2023, 15:45"
```

### Using Convenience Functions

```typescript
import { formatDateOnly, formatTimeOnly, formatDateTime } from '../utils/DateFormatter';

const date = formatDateOnly(new Date(), 'medium');
const time = formatTimeOnly(new Date(), 'short', true);
const dateTime = formatDateTime(new Date(), 'medium', 'short', true);
```

## API Reference

### DateFormatter.format()
Format a date with custom options.

```typescript
DateFormatter.format(date: Date | number | string, options?: Intl.DateTimeFormatOptions): string
```

**Example:**
```typescript
const formatted = DateFormatter.format(new Date(), {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
// English: "Monday, December 25, 2023"
// Spanish: "lunes, 25 de diciembre de 2023"
```

### DateFormatter.formatDate()
Format date only.

```typescript
DateFormatter.formatDate(
  date: Date | number | string,
  style: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string
```

**Examples:**
```typescript
DateFormatter.formatDate(new Date(), 'short');   // "12/25/23"
DateFormatter.formatDate(new Date(), 'medium');  // "Dec 25, 2023"
DateFormatter.formatDate(new Date(), 'long');    // "December 25, 2023"
DateFormatter.formatDate(new Date(), 'full');    // "Monday, December 25, 2023"
```

### DateFormatter.formatTime()
Format time only.

```typescript
DateFormatter.formatTime(
  date: Date | number | string,
  style: 'short' | 'medium' | 'long' = 'short',
  hour12: boolean = true
): string
```

**Examples:**
```typescript
DateFormatter.formatTime(new Date(), 'short', true);   // "3:45 PM"
DateFormatter.formatTime(new Date(), 'short', false);  // "15:45"
DateFormatter.formatTime(new Date(), 'long', true);    // "3:45:30 PM EST"
```

### DateFormatter.formatDateTime()
Format date and time together.

```typescript
DateFormatter.formatDateTime(
  date: Date | number | string,
  dateStyle: 'short' | 'medium' | 'long' | 'full' = 'medium',
  timeStyle: 'short' | 'medium' | 'long' = 'short',
  hour12: boolean = true
): string
```

**Example:**
```typescript
DateFormatter.formatDateTime(new Date(), 'medium', 'short', true);
// English: "Dec 25, 2023, 3:45 PM"
// Spanish: "25 dic 2023, 15:45"
```

### DateFormatter.formatRelative()
Format relative time (e.g., "2 hours ago", "in 3 days").

```typescript
DateFormatter.formatRelative(
  date: Date | number | string,
  style: 'long' | 'short' | 'narrow' = 'short'
): string
```

**Examples:**
```typescript
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
DateFormatter.formatRelative(oneHourAgo, 'short');
// English: "1 hr. ago"
// Spanish: "hace 1 h"

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
DateFormatter.formatRelative(tomorrow, 'long');
// English: "in 1 day"
// Spanish: "dentro de 1 día"
```

### DateFormatter.formatCustom()
Format with a custom pattern.

```typescript
DateFormatter.formatCustom(
  date: Date | number | string,
  pattern: string
): string
```

**Supported patterns:**
- `'YYYY-MM-DD'` → "2023-12-25"
- `'MM/DD/YYYY'` → "12/25/2023"
- `'DD MMM YYYY'` → "25 Dec 2023"
- `'MMMM DD, YYYY'` → "December 25, 2023"
- `'HH:mm'` → "15:45" (24-hour format)
- `'hh:mm A'` → "03:45 PM" (12-hour format)

### DateFormatter.getDayName()
Get the day of the week name.

```typescript
DateFormatter.getDayName(
  date: Date | number | string,
  style: 'long' | 'short' | 'narrow' = 'long'
): string
```

**Examples:**
```typescript
DateFormatter.getDayName(new Date(), 'long');   // "Monday" / "lunes"
DateFormatter.getDayName(new Date(), 'short');  // "Mon" / "lun"
DateFormatter.getDayName(new Date(), 'narrow'); // "M" / "l"
```

### DateFormatter.getMonthName()
Get the month name.

```typescript
DateFormatter.getMonthName(
  date: Date | number | string,
  style: 'long' | 'short' | 'narrow' = 'long'
): string
```

**Examples:**
```typescript
DateFormatter.getMonthName(new Date(), 'long');   // "December" / "diciembre"
DateFormatter.getMonthName(new Date(), 'short');  // "Dec" / "dic"
DateFormatter.getMonthName(new Date(), 'narrow'); // "D" / "d"
```

## Language to Locale Mapping

The formatter automatically maps language codes to locale codes:

- `en` → `en-US` (English - United States)
- `es` → `es-ES` (Spanish - Spain)

To add more languages, update the `LANGUAGE_TO_LOCALE_MAP` in `src/utils/DateFormatter.ts`:

```typescript
const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',  // Add French
  de: 'de-DE',  // Add German
  // ... etc
};
```

## React Component Example

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import DateFormatter from '../utils/DateFormatter';

const MyComponent = () => {
  const now = new Date();
  const lastUpdated = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

  return (
    <View>
      <Text>Current Date: {DateFormatter.formatDate(now, 'long')}</Text>
      <Text>Current Time: {DateFormatter.formatTime(now)}</Text>
      <Text>Last Updated: {DateFormatter.formatRelative(lastUpdated)}</Text>
      <Text>Full DateTime: {DateFormatter.formatDateTime(now)}</Text>
    </View>
  );
};

export default MyComponent;
```

## Common Use Cases

### Display date in a list item
```typescript
const listItemDate = DateFormatter.formatDate(date, 'short');
```

### Display timestamp in a chat message
```typescript
const chatTimestamp = (date: Date) => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return DateFormatter.formatRelative(date, 'short');
  } else if (diffInHours < 48) {
    return DateFormatter.formatTime(date, 'short');
  } else {
    return DateFormatter.formatDate(date, 'short');
  }
};
```

### Display date in a form field
```typescript
const formDate = DateFormatter.formatCustom(date, 'YYYY-MM-DD');
```

## How It Works

1. The `DateFormatter` reads the current language from `i18n.language`
2. It maps the language code to a locale code (e.g., `en` → `en-US`)
3. It uses the native `Intl.DateTimeFormat` API with the determined locale
4. The formatting automatically adapts when the user changes the app language

## Notes

- The formatter automatically updates when the app language changes (via i18next)
- All formatting respects the user's selected language
- The formatter accepts `Date` objects, timestamps (numbers), or date strings
- For more advanced formatting options, you can pass custom `Intl.DateTimeFormatOptions`

## See Also

- `src/utils/DateFormatter.ts` - Main implementation
- `src/utils/DateFormatter.example.ts` - Usage examples
- `src/Localization/Localize.ts` - i18next configuration

