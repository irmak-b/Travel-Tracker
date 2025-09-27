import React from 'react';
import { View, ImageBackground, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/ui/Navbar';

function HatScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/chatBack.jpeg')}
        style={styles.background}
      >
        <Navbar logoSource={require('../assets/newlogo.png')} title="Travel Tracker" />

        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.chatContainer}>
            <Text style={styles.placeholderText}>Chat ekranı burada olacak</Text>
          </View>

          {/* Mesajlar eklenecek */}
        </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1, width: '100%', height: '100%', alignItems: 'center' },
  scrollContent: {
    paddingTop: 75, 
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  chatContainer: {
    flex: 1,
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 10,
    minHeight: 600,
  },
  placeholderText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HatScreen;

