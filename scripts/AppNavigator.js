// app/AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import IndexScreen from '../app/(tabs)/home';
import LoginScreen from './(auth)/login'; // .tsx extension not needed in imports
import SignupScreen from './(auth)/signup';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Index" component={IndexScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Results" component={ResultScreen} />
    </Stack.Navigator>
  );
}