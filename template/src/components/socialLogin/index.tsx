import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from "react-native";
import GoogleSigninSampleApp from "./googleLogin";
import FacebookSignIn from "./facebookLogin";
import AppleSigninSampleApp from "./appleLogin";
import { fontHeight } from "../../styles/Fonts";
import { windowHeight } from "../../styles/Dimens";
import Colors from "../../styles/Colors";

export default function LoginScreen({ navigation }): React.JSX.Element {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <View style={styles.card}>
                <GoogleSigninSampleApp navigation={navigation} />
                <FacebookSignIn navigation={navigation} />

                {Platform.OS === "ios" && (
                    <AppleSigninSampleApp navigation={navigation} />
                )}
            </View>

            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => navigation.replace("Tabs")}
            >
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: windowHeight(20),
        backgroundColor: "#F8F9FB",
    },

    title: {
        fontSize: fontHeight.FONT22,
        fontWeight: "700",
        color: Colors.black,
        marginBottom: windowHeight(5),
    },

    subtitle: {
        fontSize: fontHeight.FONT14,
        color: "#6A6A6A",
        marginBottom: windowHeight(25),
    },

    card: {
        width: "100%",
        padding: windowHeight(20),
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 4,
    },

    skipButton: {
        marginTop: windowHeight(25),
        paddingVertical: windowHeight(12),
        paddingHorizontal: windowHeight(25),
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.black,
    },

    skipText: {
        fontSize: fontHeight.FONT16,
        textDecorationLine: "underline",
        color: Colors.black,
        fontWeight: "600",
    },
});
