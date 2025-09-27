import React from 'react';
import { Image, ImageBackground, ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/ui/Navbar';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  const navigation = useNavigation(); // ✅ navigation hook

  return (
    <SafeAreaView style={styles.box}>
      <ImageBackground style={styles.back} source={require("../assets/proMap.jpeg")}>
        <Navbar logoSource={require('../assets/newlogo.png')} title="Travel Tracker" />
        <ScrollView style={styles.content}>
          <View style={styles.firstContainer}>
            <Text style={styles.texta}>
              Travel&Tour Tracker'a hoşgeldin👋!
            </Text> 
            <Text style={styles.textb}>
              Gezdiğin ve anılarını biriktirmek istediğin her lokasyon için 
              birer Road Journal 🎫 ...
            </Text>
            <Text style={styles.textb}>
              Ayrıcalıklı seyahat ipuçları alabileceğin AI özelliği 🧭...
            </Text>
            <Text style={styles.textb}>
              Ve bütçe dostu fiyatlarla, kullanımını bekliyoruz!
            </Text>
            <Text style={styles.textb}>
              Ekranı kaydır ve fırsat dolu paketleri incele ✈️
            </Text>
          </View>

          {/* Standart Plan → AuthScreen'e yönlendirme */}
          <TouchableOpacity 
            style={styles.conteinersa} 
            onPress={() => navigation.navigate("AuthScreen")}
          >
            <Text style={styles.texta}> Standart Plan </Text>
            <Text style={styles.textc}>
              🧳 Her kıtada 10 journal {"\n"} {"\n"}
              📒 Her journal'da birer fotoğraf ekleme hakkı {"\n"} {"\n"}
              🗺️ AI ile 24 saatte 10 kerelik konuşma hakkı {"\n"} {"\n"}
              Ücretsiz
            </Text>
          </TouchableOpacity>

          <View style={styles.conteinersb}>
            <Text style={styles.texta}> Ekonomik Plan </Text>
            <Text style={styles.textc}>
              🧳 Her kıtada 25 journal {"\n"} {"\n"}
              📒 Her journal'da 5 fotoğraf ekleme hakkı {"\n"} {"\n"}
              🗺️ AI ile sınırsız konuşma hakkı {"\n"} {"\n"}
              Ayda yalnızca 100₺
            </Text>
          </View>

          <View style={styles.conteinersc}>
            <Text style={styles.texta}>Tam Plan </Text>
            <Text style={styles.textc}>
              🧳 Her kıtada sınırsız journal {"\n"} {"\n"}
              📒  Her journal'da sınırsız fotoğraf ekleme hakkı {"\n"} {"\n"}
              🗺️ AI ile 24 saatte sınırsız konuşma hakkı ve ses özelliği {"\n"} {"\n"}
              Ayda yalnızca 180₺
            </Text>
          </View>
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
    width: 360, 
    height: 440, 
    padding: 20, 
    marginBottom: 150,  
    alignSelf: "flex-start" 
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
