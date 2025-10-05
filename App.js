import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { adapty } from "react-native-adapty";
import AdaptyConstants from "./AdaptyConstents";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { UserProvider } from './app/UserContext';

import OnboardingScreen from './app/screens/OnboardingScreen';
import OnboardingScreen2 from './app/screens/OnboardingScreen2';
import OnboardingScreen3 from './app/screens/OnboardingScreen3';
import WindowScreen from './app/screens/WindowScreen';
import NoteScreen from './app/screens/NoteScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AuthScreen from './app/screens/AuthScreen';
import EconomyScreen from './app/screens/EconomyScreen';
import ChatScreen from "./app/screens/ChatScreen";
import FullScreen from "./app/screens/FullScreen";
import PlanSelectionScreen from "./app/screens/PlanSelectionScreen";
import LogoutScreen from "./app/screens/LogoutScreen";




const Stack = createNativeStackNavigator();
adapty.activate(AdaptyConstants.API_KEY)
  .then(() => console.log("Adapty activated!"))
  .catch(err => console.error("Adapty activation failed:", err));

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
          <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
          <Stack.Screen name="Home" component={WindowScreen} />
          <Stack.Screen name="Note" component={NoteScreen} />
          <Stack.Screen name="WindowScreen" component={WindowScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> 
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="EconomyScreen" component={EconomyScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="FullScreen" component={FullScreen} />
          <Stack.Screen name="PlanSelectionScreen" component={PlanSelectionScreen} />
          <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </UserProvider>
  );
}
