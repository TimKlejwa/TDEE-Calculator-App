// app/(auth)/signup.tsx
import { authStyles } from '@/components/WeightTracker/authstyles';
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const { signUp, loading } = useAuth();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const { error } = await signUp(email, password, name);
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      Alert.alert('Signup Error', errorMessage);
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Create Account</Text>
      
      <TextInput
        style={authStyles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      
      <TextInput
        style={authStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={authStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={authStyles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      {loading ? (
        <ActivityIndicator size="small" color="#2E7D32" />
      ) : (
        <TouchableOpacity style={authStyles.button} onPress={handleSignup}>
          <Text style={authStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}