import { SafeAreaView, Button } from "react-native";
import { Text, View } from "react-native";
import { showToast } from '../contexts/ToastContext';
import Images from '../utils/Images';

export default function HomeScreen(): React.JSX.Element {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                <Text style={{ marginBottom: 12, textAlign: 'center' }}>Welcome Home</Text>
                <Button title="Show Info Toast" onPress={() => showToast({ text: 'Hello from Info', type: 'info' })} />
                <View style={{ height: 8 }} />
                <Button title="Show Success Toast" onPress={() => showToast({ text: 'Operation succeeded', type: 'success' })} />
                <View style={{ height: 8 }} />
                <Button title="Show Error Toast" onPress={() => showToast({ text: 'Something went wrong', type: 'error' })} />
                <View style={{ height: 8 }} />
                <Button title="Show Toast w/ Image" onPress={() => showToast({ text: 'With image', imageSource: Images.home })} />
            </View>
        </SafeAreaView>
    );
}