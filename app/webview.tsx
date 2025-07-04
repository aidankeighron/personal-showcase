import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";

export default function WebViewScreen() {
    const {uri} = useLocalSearchParams();

    return <SafeAreaView style={styles.AndroidSafeArea}>
        <WebView source={{uri: Array.isArray(uri) ? uri[0] : uri}} style={styles.media} />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
    },
    media: {
        width: '100%',
        height: '100%',
    },
});