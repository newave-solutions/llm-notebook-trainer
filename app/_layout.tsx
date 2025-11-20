import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = fetch;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E293B',
          },
          headerTintColor: '#FFF',
          contentStyle: {
            backgroundColor: '#0F172A',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </AuthProvider>
  );
}