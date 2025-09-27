// app/screens/OnboardingScreen.js
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const video = React.useRef(null);

  return (
    <View style={styles.container}>
      {/* Arka Plan Video */}
      <Video
        ref={video}
        style={StyleSheet.absoluteFill}
        source={require("../assets/ilk.mp4")} 
        resizeMode="cover"
        shouldPlay
        isLooping
      />

      
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.replace("Onboarding2")}
        >
          <Text style={styles.nextText}>Sonraki➝</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
  },
  nextButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
