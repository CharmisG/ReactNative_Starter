import React from 'react';
import { View, TextInput } from 'react-native';
import { EditorCardStyles } from './TextEditorStyles';

interface EditorCardProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	editable?: boolean;
}

export const EditorCard = React.memo<EditorCardProps>(({
	value,
	onChangeText,
	placeholder = 'Start writing here...',
	editable = true,
}) => (
	<View style={EditorCardStyles.editorCard}>
		<TextInput
			style={EditorCardStyles.textInput}
			multiline
			placeholder={placeholder}
			value={value}
			onChangeText={onChangeText}
			placeholderTextColor="#888"
			editable={editable}
		/>
	</View>
));

EditorCard.displayName = 'EditorCard';

