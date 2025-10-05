import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, Text, View, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/ui/Navbar';
import { UserContext } from '../UserContext';

function WindowScreen() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext); // Context’ten kullanıcıyı al

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={require("../assets/backgr.jpeg")} style={styles.background}>
        {/* Navbar’a kullanıcı adı veya default title gönder */}
        <Navbar logoSource={require("../assets/newlogo.png")} title={user?.name || "Travel Tracker"} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.subText}>Travel tracker awaits you and your memories wherever you go!{"\n"}</Text>
            <Text style={styles.subText}>Use 7 continents below to track your Road Journals...</Text>
          </View>

          {[1,2,3,4,5,6,7].map((i) => {
            const images = [
              require("../assets/asia.jpeg"),
              require("../assets/nyc.jpeg"),
              require("../assets/europe.jpg"),
              require("../assets/rio.jpeg"),
              require("../assets/antarktika.jpeg"),
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
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
            <Image style={styles.compass} source={require('../assets/compa.png')} />
          </TouchableOpacity>
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
  logbutton: { width: 70, height: 50, alignItems: "center", justifyContent: "center", position: "absolute", right: 2, bottom: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  mage:{ width: 310, height: 205, borderRadius: 15, opacity:0.96 },
  compass:{width:70,height:70},
});

export default WindowScreen;
