
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../styles/Colors';
import { fontHeight } from '../styles/Fonts';
import { windowHeight, windowWidth } from '../styles/Dimens';

const TextEditorScreen = () => {
    const [text, setText] = useState('');
    const [errors, setErrors] = useState<string[]>([]); // Change to array to hold multiple errors
    const [title, setTitle] = useState<string | null>(null); // Change to string | null

    const checkSpellingAndGrammar = async () => {
        const lines = text.split('\n'); // Split text into lines
        const allErrors: string[] = []; // Array to hold all errors

        for (const line of lines) {
            if (line.trim()) { // Check if the line is not empty
                try {
                    const response = await fetch('https://api.languagetoolplus.com/v2/check', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            text: line, // Check each line
                            language: 'en-US',
                        }).toString(), // Convert to string
                    });

                    // Check if the response is OK (status code 200)
                    if (!response.ok) {
                        const errorText = await response.text(); // Get the response text
                        console.error('Error response:', errorText); // Log the error response
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    console.log('Response data:', JSON.stringify(data));

                    // Extract errors for the current line
                    if (data.matches.length > 0) {
                        data.matches.forEach((match: any) => {
                            setTitle(match.rule.issueType); // Set the title based on the first match
                            allErrors.push(match.message); // Collect error messages
                        });
                    }
                } catch (error) {
                    console.error('Error checking spelling and grammar:', error);
                    allErrors.push('An error occurred while checking this line.');
                }
            }
        }

        // Set the title and errors based on the collected errors
        if (allErrors.length > 0) {
            // setTitle('ERRORS');
            setErrors(allErrors);
        } else {
            setErrors([]); // Reset errors if no matches
            setTitle(null); // Reset title if no errors
        }
    };

    return (
        <View style={styles.container}>

            {/* ✏️ Title */}
            <Text style={styles.heading}>Text Editor</Text>

            {/* 📝 Editor Card */}
            <View style={styles.editorCard}>
                <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Start writing here..."
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor="#888"
                />
            </View>

            {/* 🔵 Modern Button */}
            <TouchableOpacity style={styles.button} onPress={checkSpellingAndGrammar}>
                <Text style={styles.buttonText}>Check Spelling & Grammar</Text>
            </TouchableOpacity>

            {/* ⚠ Error Card */}
            {errors.length > 0 && (
                <View style={styles.errorCard}>
                    <Text style={styles.errorTitle}>
                        {title?.toUpperCase() || "GRAMMAR"} ERRORS
                    </Text>

                    {errors.map((err, i) => (
                        <Text key={i} style={styles.errorText}>
                            • {err}
                        </Text>
                    ))}
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
    },

    heading: {
        fontSize: fontHeight.FONT21,
        fontWeight: "800",
        marginBottom: windowWidth(20),
        color: Colors.black,
        letterSpacing: 0.5,
    },

    /* 📝 Editor Card */
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
        textAlignVertical: "top",
    },

    /* 🔵 Button */
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: windowHeight(14),
        borderRadius: 12,
        alignItems: "center",

        shadowColor: Colors.primary,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },

    buttonText: {
        color: Colors.white,
        fontSize: fontHeight.FONT16,
        fontWeight: "700",
    },

    /* ⚠ Error Card */
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
        fontWeight: "700",
        color: Colors.errorText,
        marginBottom: windowHeight(10),
    },

    errorText: {
        fontSize: fontHeight.FONT13,
        color: Colors.errorText,
        marginBottom: windowHeight(6),
    },
});


export default TextEditorScreen;
