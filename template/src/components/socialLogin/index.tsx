import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/NavParamTypes';
import GoogleSigninSampleApp from "./googleLogin";
import FacebookSignIn from "./facebookLogin";
import AppleSigninSampleApp from "./appleLogin";
import { fontHeight } from "../../styles/Fonts";
import { windowHeight } from "../../styles/Dimens";
import Colors from "../../styles/Colors";
import { FeatureFlags } from "../../config/AppConfig";
import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { AuthContext } from "../../hooks/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props): React.JSX.Element {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);

    useEffect(() => {
        if (!FeatureFlags?.authProviders?.google && !FeatureFlags?.authProviders?.facebook
            || (!FeatureFlags?.authProviders?.apple && Platform.OS !== "ios")) {
            navigation.replace("Tabs");
        }
    }, []);

    const handleEmailLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email.trim(), password);
            login("email");
            navigation.replace("Tabs");
        } catch (error: any) {
            let errorMessage = "Login failed. Please try again.";
            if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
            } else if (error.code === "auth/user-disabled") {
                errorMessage = "This account has been disabled.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many failed attempts. Please try again later.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            Alert.alert("Login Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <View style={styles.card}>
                {/* Email and Password Input Fields */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={Colors.grey}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor={Colors.grey}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        activeOpacity={0.7}
                    >
                        <View style={styles.eyeIconGlyph}>
                            <View style={styles.eyeOutline} />
                            <View style={styles.eyePupil} />
                            {!showPassword && <View style={styles.eyeSlash} />}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Email/Password Login Button */}
                <TouchableOpacity
                    style={[styles.emailLoginButton, isLoading && styles.buttonDisabled]}
                    onPress={handleEmailLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.emailLoginButtonText}>
                        {isLoading ? "Logging in..." : "Login with Email"}
                    </Text>
                </TouchableOpacity>

                {/* Divider */}
                {(FeatureFlags?.authProviders?.google || FeatureFlags?.authProviders?.facebook ||
                    (FeatureFlags?.authProviders?.apple && Platform.OS === "ios")) && (
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>
                    )}

                {/* Social Login Buttons */}
                {FeatureFlags?.authProviders?.google && (
                    <GoogleSigninSampleApp navigation={navigation} />
                )}
                {FeatureFlags?.authProviders?.facebook && (
                    <FacebookSignIn navigation={navigation} />
                )}
                {FeatureFlags?.authProviders?.apple && (Platform.OS === "ios" && (
                    <AppleSigninSampleApp navigation={navigation} />
                ))}

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
    },

    inputContainer: {
        width: "100%",
        marginBottom: windowHeight(15),
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.silver,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        paddingHorizontal: windowHeight(10),
        paddingVertical: windowHeight(8),
        fontSize: fontHeight.FONT14,
        color: Colors.black,
        flex: 1,
    },

    passwordInput: {
        paddingHorizontal: windowHeight(10),
        paddingVertical: windowHeight(8),
        fontSize: fontHeight.FONT14,
        color: Colors.black,
        flex: 1,
    },

    eyeIcon: {
        position: "absolute",
        right: windowHeight(15),
        padding: windowHeight(5),
        justifyContent: "center",
        alignItems: "center",
    },

    eyeIconGlyph: {
        width: windowHeight(20),
        height: windowHeight(20),
        justifyContent: "center",
        alignItems: "center",
    },

    eyeOutline: {
        position: "absolute",
        width: windowHeight(16),
        height: windowHeight(10),
        borderWidth: 1.5,
        borderColor: Colors.charcoal,
        borderRadius: windowHeight(8),
        transform: [{ scaleX: 1.6 }],
    },

    eyePupil: {
        width: windowHeight(6),
        height: windowHeight(6),
        borderRadius: windowHeight(3),
        backgroundColor: Colors.charcoal,
    },

    eyeSlash: {
        position: "absolute",
        width: windowHeight(18),
        height: 1.5,
        backgroundColor: Colors.charcoal,
        transform: [{ rotate: "-30deg" }],
    },

    emailLoginButton: {
        width: "100%",
        paddingVertical: windowHeight(14),
        borderRadius: 8,
        alignItems: "center",
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
        fontWeight: "700",
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: windowHeight(20),
        width: "100%",
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
        fontWeight: "500",
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
