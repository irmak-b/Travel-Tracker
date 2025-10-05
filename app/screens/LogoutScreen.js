// app/screens/ProfileScreen.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { UserContext } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

export default function LogoutScreen() {
  const { user, logout } = useContext(UserContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            await logout();
            navigation.replace("AuthScreen"); // login sayfasına yönlendir
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Giriş yapılmamış</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.text}>Kullanıcı: {user.name}</Text>
      <Text style={styles.text}>ID: {user.id}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: "#c0392b", padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
