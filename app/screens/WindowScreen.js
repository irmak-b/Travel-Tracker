import React from 'react';
import { ImageBackground, StyleSheet, Text, View, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/ui/Navbar';


function WindowScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={require("../assets/backgr.jpeg")} style={styles.background}>
        <Navbar logoSource={require("../assets/newlogo.png")} title="Travel Tracker" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hoşgeldiniz!</Text>
            <Text style={styles.subText}>Adım attığınız her yerde app sizin yanınızda anılarınızı bekliyor!</Text>
          </View>

          {[1,2,3,4,5,6,7].map((i) => {
            const images = [
              require("../assets/asia.jpg"),
              require("../assets/chicago.png"),
              require("../assets/europe.jpg"),
              require("../assets/brazil.jpeg"),
              require("../assets/rome.jpeg"),
              require("../assets/africa.jpeg"),
              require("../assets/opera.jpg")
            ];
            return (
              <TouchableOpacity key={i} onPress={() => navigation.navigate("Note", { id: i })}>
                <View style={styles.container}>
                  <Image style={styles.mage} source={images[i-1]} />
                </View>
              </TouchableOpacity>
            );
          })}

        </ScrollView>

        <View style={styles.logbutton}>
          
              <View style={styles.logbutton}>
                <TouchableOpacity onPress={() => navigation.navigate('Hat')}>
                  <Image style={styles.compass} source={require('../assets/compa.png')} />
                </TouchableOpacity>
              </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1, width: '100%', height: '100%', alignItems: 'center' },
  scrollContent: { alignItems: 'center', paddingTop: 100, paddingBottom: 100 },
  welcomeContainer: { backgroundColor: "#20ac6abb", width: 360, height:240, padding: 20, marginBottom: 20, alignItems: "center" },
  welcomeText: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  subText: { fontFamily:"sans-serif-thin", fontSize: 18, color: "#fff" },
  container: { width: 310, height: 210, borderRadius: 15, alignItems: "center", justifyContent:"center", marginBottom: 20 },
  logbutton: { width: 70, height: 50,  alignItems: "center", justifyContent: "center", position: "absolute", right: 2, bottom: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  mage:{ width: 310, height: 205, borderRadius: 15, opacity:0.96 },
  compass:{width:70,height:70},
});

export default WindowScreen;
