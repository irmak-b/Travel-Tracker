import React from 'react';
import { Image, ImageBackground, ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/ui/Navbar';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { Video } from "expo-av";

const { width, height } = Dimensions.get('window');


function ProfileScreen() {
  const navigation = useNavigation(); 
  const video = React.useRef(null);

  return (
    <SafeAreaView style={styles.box}>
      <ImageBackground style={styles.back} source={require("../assets/proMap.jpeg")}>
        <Navbar logoSource={require('../assets/newlogo.png')} title="Travel Tracker" />
        <ScrollView style={styles.content}>
          <View style={styles.firstContainer}>
            <Text style={styles.texta}>
              You're Welcome to Travel&Tour Tracker 👋!
            </Text> 
            <Text style={styles.textb}>
              A Road Journal for every location you visit and want to capture your memories🎫 ...
            </Text>
            <Text style={styles.textb}>
              An AI feature that provides you with exclusive travel tips. 🧭...
            </Text>
            <Text style={styles.textb}>
              And all at budget-friendly prices, waiting for you to use!
            </Text>
            <Text style={styles.textb}>
              Swipe the screen and explore our offer-packed plans.✈️
            </Text>
          </View>

          {/* Standart Plan  AuthScreene yönlendirme */}
          <TouchableOpacity 
            style={styles.conteinersa} 
            onPress={() => navigation.navigate("AuthScreen")}
          >
            <Text style={styles.texta}> Standard Plan </Text>
            <Text style={styles.textc}>
                🧳 10 Journal per Continent {"\n"} {"\n"}
                📒 Add up 1 photo in a journal {"\n"} {"\n"}
                🗺️ 10 Compass conversations per day within 24 hours {"\n"} {"\n"}
              For Free 
            </Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.conteinersb} 
            onPress={() => navigation.navigate("EconomyScreen")}
          >
            <Text style={styles.texta}> Economy Plan </Text>
            <Text style={styles.textc}>
              🧳 25 Journal per Continent {"\n"} {"\n"}
              📒 Add up 5 photo in a journal{"\n"} {"\n"}
              🗺️ Unlimited Compass Acces {"\n"} {"\n"}
              Only for 0.8$ per Month!
            </Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.conteinersc} 
            onPress={() => navigation.navigate("FullScreen")}
          >
            <Text style={styles.texta}>Full Plan </Text>
            <Text style={styles.textc}>
              🧳  25 Journal per Continent {"\n"} {"\n"}
              📒  Add up 15 photo in a journal {"\n"} {"\n"}
              🗺️ Unlimited Compass Acces {"\n"} {"\n"}
              Only for 1$ per Month
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#000' },
  back: { flex: 1, width: '100%', height: '100%' },
  content: { paddingTop: 75, paddingBottom: 20 },
  firstContainer: { 
    backgroundColor: "#bb564b9c", 
    width: width - 0, 
    height: height * 0.7, 
    padding: 20, 
    marginBottom: 150,  
    alignSelf: "center" 
},

  conteinersa: {
    width: 280, height: 410,
    backgroundColor:"#357272a4", 
    borderRadius: 15, 
    alignItems: "center", 
    justifyContent:"center",
    alignSelf: "center", 
    marginBottom: 40
  },
  conteinersb: {
    width: 280, height: 410,
    backgroundColor:"#b3742893", 
    borderRadius: 15, 
    alignItems: "center", 
    justifyContent:"center",
    alignSelf: "center", 
    marginBottom: 40
  },
  conteinersc: {
    width: 280, height: 410,
    backgroundColor:"#4e2728a8", 
    borderRadius: 15, 
    alignItems: "center", 
    justifyContent:"center",
    alignSelf: "center", 
    marginBottom: 40
  },
  texta: { fontSize:26, fontWeight: "bold", color: "#fff", marginTop:10, marginBottom:20 },
  textb: { fontFamily:"sans-serif-thin", fontSize: 20, color: "#fff", marginTop:20, marginBottom:20 },
  textc: { fontFamily:"sans-serif-thin", fontSize: 20, color: "#fff", marginTop:30, marginBottom:30 }
});
