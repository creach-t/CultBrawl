import { Text, View, Button } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Bienvenue sur CultBrawl!</Text>
      <Button
        title="Se Connecter"
        onPress={() => router.push('/auth')}
      />
    </View>
  );
}
