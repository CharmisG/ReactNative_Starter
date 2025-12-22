import { StyleSheet, Platform } from 'react-native';
import Colors from '../../styles/Colors';
import { fontHeight } from '../../styles/Fonts';
import { windowHeight, windowWidth } from '../../styles/Dimens';

export const DashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topHalf: {
        flex: 0.5,
        backgroundColor: Colors.primary,
    },
    bottomHalf: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerText: {
        textAlign: 'center',
        fontSize: fontHeight.FONT28,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: Colors.white,
    },
    hamburgerIcon: {
        marginLeft: 10,
        height: 24,
        width: 24,
        tintColor: Colors.black,
        alignSelf: 'flex-start',
    },
    listHeader: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listHeaderText: {
        color: 'grey',
        fontSize: fontHeight.FONT14,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        minHeight: 300,
    },
    emptyText: {
        fontSize: fontHeight.FONT16,
        textAlign: 'center',
    },
    errorContainer: {
        marginHorizontal: 10,
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    errorText: {
        fontSize: fontHeight.FONT14,
        fontWeight: '500',
    },
});

export const MenuModalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    popup: {
        borderRadius: 6,
        borderColor: Colors.white,
        borderWidth: 1,
        shadowColor: Colors.primary,
        shadowOpacity: 0.8,
        shadowRadius: 4,
        backgroundColor: Colors.white,
        paddingHorizontal: windowWidth(10),
        paddingVertical: windowHeight(10),
        position: 'absolute',
        width: undefined,
        top: Platform.OS === 'ios' ? windowHeight(80) : windowHeight(30),
        left: windowWidth(20),
        justifyContent: 'flex-start',
    },
    optionContainer: {
        flexDirection: 'row',
        margin: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    optionIcon: {
        height: 24,
        width: 24,
        marginLeft: 10,
        marginRight: 20,
    },
    optionText: {
        marginVertical: 8,
        fontSize: 16,
    },
});

export const ConfirmModalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: windowWidth(0),
            height: windowHeight(2),
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        margin: 8,
    },
    buttonClose: {
        backgroundColor: Colors.primary,
    },
    textStyle: {
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: fontHeight.FONT18,
        margin: 15,
        textAlign: 'center',
    },
});

export const ListItemStyles = StyleSheet.create({
    item: {
        backgroundColor: Colors.white,
        padding: 6,
        marginVertical: windowHeight(8),
        marginHorizontal: windowWidth(10),
        borderRadius: 2,
        shadowColor: Colors.grey,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    itemTextColor: {
        color: 'grey',
        fontSize: fontHeight.FONT14,
    },
});

