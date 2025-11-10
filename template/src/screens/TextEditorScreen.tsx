
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

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
            <TextInput
                style={styles.textInput}
                multiline
                placeholder="Start writing here..."
                value={text}
                onChangeText={setText}
            />
            <Button title="Check Spelling & Grammar" onPress={checkSpellingAndGrammar} />
            {errors.length > 0 && ( // Check if there are any errors
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>{title?.toUpperCase()} ERROR :</Text>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>• {error}</Text>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        height: 300,
        padding: 10,
        marginBottom: 10,
    },
    errorContainer: {
        marginTop: 16,
        padding: 10,
        backgroundColor: '#f8d7da',
        borderRadius: 5,
    },
    errorTitle: {
        fontWeight: 'bold',
        color: '#721c24',
    },
    errorText: {
        color: '#721c24',
    },
});

export default TextEditorScreen;

// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

// const TextEditorScreen = () => {
//     const [text, setText] = useState('');
//     const [errors, setErrors] = useState<string | null>(null); // Change to string | null
//     const [title, setTitle] = useState<string | null>(null); // Change to string | null


//     const checkSpelling = async () => {
//         try {
//             const response = await fetch('https://api.languagetoolplus.com/v2/check', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body: new URLSearchParams({
//                     text: text, // Ensure this is not empty
//                     language: 'en-US',
//                 }).toString(), // Convert to string
//             });

//             // Check if the response is OK (status code 200)
//             if (!response.ok) {
//                 const errorText = await response.text(); // Get the response text
//                 console.error('Error response:', errorText); // Log the error response
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
//             }

//             const data = await response.json();
//             console.log('Response data:', JSON.stringify(data));

//             // Extract only the misspelled words
//             if (data['matches'].length !== 0) {
//                 console.log('Response data123:', data['matches'][0]['message']);
//                 setTitle(data['matches'][0]['rule']['issueType']); // Set the title
//                 setErrors(data['matches'][0]['message']); // Set the error message
//             } else {
//                 setErrors(null); // Reset errors if no matches
//             }
//         } catch (error) {
//             console.error('Error checking spelling:', error);
//             setErrors('An error occurred while checking spelling.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.textInput}
//                 multiline
//                 placeholder="Start writing here..."
//                 value={text}
//                 onChangeText={setText}
//             />
//             <Button title="Check Spelling" onPress={checkSpelling} />
//             {errors && ( // Check if errors is not null
//                 <View style={styles.errorContainer}>
//                     <Text style={styles.errorTitle}>{title?.toUpperCase()} ERROR</Text>
//                     <Text style={styles.errorText}>• {errors}</Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     textInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         height: 300,
//         padding: 10,
//         marginBottom: 10,
//     },
//     errorContainer: {
//         marginTop: 16,
//         padding: 10,
//         backgroundColor: '#f8d7da',
//         borderRadius: 5,
//     },
//     errorTitle: {
//         fontWeight: 'bold',
//         color: '#721c24',
//     },
//     errorText: {
//         color: '#721c24',
//     },
// });

// export default TextEditorScreen;


