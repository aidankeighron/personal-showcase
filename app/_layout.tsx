import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack>
    <Stack.Screen name="home" options={{ headerShown: false }} />
    <Stack.Screen name="webview" options={{headerTitle: ""}} />
  </Stack>
}