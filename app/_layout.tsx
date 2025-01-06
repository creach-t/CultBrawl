import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Accueil" }} />
      <Stack.Screen name="auth" options={{ headerTitle: "Connexion" }} />
      <Stack.Screen name="signup" options={{ headerTitle: "Inscription" }} />
    </Stack>
  );
}
