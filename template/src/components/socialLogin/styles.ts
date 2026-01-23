import { StyleSheet } from 'react-native';
import { fontHeight } from '../../styles/Fonts';
import { windowHeight } from '../../styles/Dimens';
import Colors from '../../styles/Colors';

export const LoginScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: windowHeight(20),
        backgroundColor: '#F8F9FB',
    },
    title: {
        fontSize: fontHeight.FONT22,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: windowHeight(5),
    },
    subtitle: {
        fontSize: fontHeight.FONT14,
        color: '#6A6A6A',
        marginBottom: windowHeight(25),
    },
    card: {
        width: '100%',
    },
    emailLoginButton: {
        width: '100%',
        paddingVertical: windowHeight(14),
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: windowHeight(15),
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    emailLoginButtonText: {
        color: Colors.black,
        fontSize: fontHeight.FONT14,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: windowHeight(20),
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.silver,
    },
    dividerText: {
        marginHorizontal: windowHeight(15),
        fontSize: fontHeight.FONT14,
        color: Colors.grey,
        fontWeight: '500',
    },
});

