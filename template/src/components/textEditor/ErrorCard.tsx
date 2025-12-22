import React from 'react';
import { View, Text } from 'react-native';
import { ErrorCardStyles } from './TextEditorStyles';

interface ErrorCardProps {
    title: string | null;
    errors: string[];
}

export const ErrorCard = React.memo<ErrorCardProps>(({ title, errors }) => {
    if (errors.length === 0) {
        return null;
    }

    return (
        <View style={ErrorCardStyles.errorCard}>
            <Text style={ErrorCardStyles.errorTitle}>
                {title?.toUpperCase() || 'GRAMMAR'} ERRORS
            </Text>
            {errors.map((err, i) => (
                <Text key={i} style={ErrorCardStyles.errorText}>
                    • {err}
                </Text>
            ))}
        </View>
    );
});

ErrorCard.displayName = 'ErrorCard';

