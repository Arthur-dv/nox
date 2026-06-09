import { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Geist_400Regular, Geist_700Bold } from '@expo-google-fonts/geist';
import { RootStackParamList } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import DetailScreen from './src/screens/DetailScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular,
    Geist_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontFamily: 'Geist_700Bold' },
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: 'Voltar',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Resultados' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
