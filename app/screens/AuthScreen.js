// app/screens/AuthScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/ui/Navbar';

// 🔹 sadece firebase.js’ten import et
import { auth, db } from "../firebase";

function AuthScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: 'Tamam' }], { cancelable: true });
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !email.trim()) {
      showAlert('Hata', 'Kullanıcı adı, parola ve email boş olamaz.');
      return;
    }
    setLoading(true);
    try {
      // Firebase Auth ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore’a kullanıcı bilgilerini ekle
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: new Date()
      });

      await AsyncStorage.setItem('currentUser', user.uid);
      showAlert('Başarılı', 'Kayıt başarılı! Giriş yapılıyor...');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      showAlert('Hata', error.message);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Hata', 'Email ve parola boş olamaz.');
      return;
    }
    setLoading(true);
    try {
      // Firebase Auth ile giriş
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await AsyncStorage.setItem('currentUser', user.uid);
      showAlert('Başarılı', 'Giriş başarılı.');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      showAlert('Hata', error.message);
    }
    setLoading(false);
  };

  const onSubmit = () => {
    if (mode === 'login') handleLogin();
    else handleRegister();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require("../assets/login.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
      <Navbar logoSource={require('../assets/newlogo.png')} title="Travel Tracker" />
        <KeyboardAvoidingView 
          style={styles.keyboard} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.card}>
            <Text style={styles.title}>
              {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </Text>

            {mode === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı adı"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Parola"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={onSubmit} 
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.smallText}>
                {mode === 'login' ? 'Hesabın yok mu?' : 'Zaten hesabın mı var?'}
              </Text>
              <TouchableOpacity 
                onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                <Text style={styles.switchText}>
                  {mode === 'login' ? ' Kayıt Ol' : ' Giriş Yap'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                AsyncStorage.setItem('currentUser', 'guest')
                  .then(() => navigation.replace('Home'));
              }}
              style={styles.guestBtn}
            >
              <Text style={styles.guestText}>Misafir Olarak Devam Et</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default AuthScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  background: { flex: 1, width: '100%', height: '100%' },
  keyboard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#357272de', borderRadius: 12, padding: 20, elevation: 4 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#111' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 10 },
  button: { backgroundColor: '#1b3753ff', padding: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#bebdbdff', fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  smallText: { color: '#333' },
  switchText: { color: '#0c2a47ff', fontWeight: '600' },
  guestBtn: { marginTop: 12, alignItems: 'center' },
  guestText: { color: '#000000ff', textDecorationLine: 'underline' },
});
