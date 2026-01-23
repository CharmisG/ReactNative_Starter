import React from 'react';
import { View, Text } from 'react-native';
import { AppConstants } from '../../constants/AppConstants';
import Colors from '../../styles/Colors';
import { ListItemStyles } from './DashboardStyles';

interface ListItemProps {
    appTheme: string;
    title: string;
    completed: boolean;
    id: number;
}

export const ListItem = React.memo<ListItemProps>(({
    appTheme,
    title,
    completed,
    id,
}) => {
    const backgroundColor = appTheme === AppConstants.dark ? Colors.black : Colors.white;

    return (
        <View style={[ListItemStyles.item, { backgroundColor }]}>
            <Text style={ListItemStyles.itemTextColor}>{id}</Text>
            <Text style={ListItemStyles.itemTextColor}>{title}</Text>
            <Text style={ListItemStyles.itemTextColor}>{completed?.toString()}</Text>
        </View>
    );
});

ListItem.displayName = 'ListItem';

