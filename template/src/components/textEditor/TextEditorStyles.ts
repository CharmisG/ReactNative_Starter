import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontHeight } from '../../styles/Fonts';
import { windowHeight, windowWidth } from '../../styles/Dimens';

export const TextEditorStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: Colors.white,
	},
	heading: {
		fontSize: fontHeight.FONT21,
		fontWeight: '800',
		marginBottom: windowWidth(20),
		color: Colors.black,
		letterSpacing: 0.5,
	},
});

export const EditorCardStyles = StyleSheet.create({
	editorCard: {
		backgroundColor: Colors.white,
		padding: 14,
		borderRadius: 15,
		marginBottom: windowHeight(15),
		shadowColor: Colors.black,
		shadowOpacity: 0.1,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
	textInput: {
		height: windowHeight(200),
		fontSize: fontHeight.FONT16,
		color: Colors.black,
		textAlignVertical: 'top',
	},
});

export const ErrorCardStyles = StyleSheet.create({
	errorCard: {
		backgroundColor: Colors.errorBackground,
		padding: 16,
		borderRadius: 12,
		marginTop: windowHeight(20),
		shadowColor: Colors.errorText,
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 3,
	},
	errorTitle: {
		fontSize: fontHeight.FONT14,
		fontWeight: '700',
		color: Colors.errorText,
		marginBottom: windowHeight(10),
	},
	errorText: {
		fontSize: fontHeight.FONT13,
		color: Colors.errorText,
		marginBottom: windowHeight(6),
	},
});

export const ButtonStyles = StyleSheet.create({
	button: {
		backgroundColor: Colors.primary,
		paddingVertical: windowHeight(14),
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: Colors.primary,
		shadowOpacity: 0.25,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: Colors.white,
		fontSize: fontHeight.FONT16,
		fontWeight: '700',
	},
});

