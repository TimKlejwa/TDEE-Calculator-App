// app/(auth)/login.tsx
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, TextInput, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error) {
      // Proper error handling
      let errorMessage = 'Failed to login';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      Alert.alert('Login Error', errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <Link href="/(auth)/signup" style={{ marginTop: 15, textAlign: 'center' }}>
        Don't have an account? Sign up
      </Link>
    </View>
  );
}