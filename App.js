import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from './app/screens/OnboardingScreen';
import OnboardingScreen2 from './app/screens/OnboardingScreen2';
import OnboardingScreen3 from './app/screens/OnboardingScreen3';
import WindowScreen from './app/screens/WindowScreen';
import NoteScreen from './app/screens/NoteScreen';
import HatScreen from './app/screens/HatScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AuthScreen from './app/screens/AuthScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="Home" component={WindowScreen} />
        <Stack.Screen name="Note" component={NoteScreen} />
        <Stack.Screen name="WindowScreen" component={WindowScreen} />
        <Stack.Screen name="Hat" component={HatScreen} /> 
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> 
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        

      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
