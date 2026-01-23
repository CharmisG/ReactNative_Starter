import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../navigation/NavParamTypes';
import Translate from '../hooks/Translate';
import { useTextEditor } from '../hooks/useTextEditor';
import { EditorCard } from '../components/textEditor/EditorCard';
import { ErrorCard } from '../components/textEditor/ErrorCard';
import { TextEditorStyles, ButtonStyles } from '../components/textEditor/TextEditorStyles';
import Navbar from '../components/Navbar';

type Props = NativeStackScreenProps<RootStackParamList, 'TextEditor'>;

const TextEditorScreen: React.FC<Props> = ({ navigation }) => {
    const {
        text,
        setText,
        errors,
        title,
        isChecking,
        checkSpellingAndGrammar,
    } = useTextEditor();

    const buttonText = useMemo(
        () => (isChecking ? 'Checking...' : 'Check Spelling & Grammar'),
        [isChecking]
    );

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Navbar
                screenTitle={Translate('Text Editor')}
                leftIconPressed={handleBackPress}
            />
            <View style={TextEditorStyles.container}>
                <Text style={TextEditorStyles.heading}>{Translate('Text Editor')}</Text>

                <EditorCard
                    value={text}
                    onChangeText={setText}
                    editable={!isChecking}
                />

                <TouchableOpacity
                    style={[
                        ButtonStyles.button,
                        isChecking && ButtonStyles.buttonDisabled,
                    ]}
                    onPress={checkSpellingAndGrammar}
                    disabled={isChecking}
                >
                    <Text style={ButtonStyles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>

                <ErrorCard title={title} errors={errors} />
            </View>
        </SafeAreaView>
    );
};

export default React.memo(TextEditorScreen);
