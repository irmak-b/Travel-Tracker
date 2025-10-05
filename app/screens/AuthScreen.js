// app/screens/AuthScreen.js
import React, { useState, useContext } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/ui/Navbar';
import { supabase } from '../supabase';
import { UserContext } from '../UserContext';

function AuthScreen() {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); // context
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: 'OK' }], { cancelable: true });
  };

  // Kayıt işlemi
  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      showAlert('Error', 'Name, email, and password cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // authnew tablosuna ekleme (upsert ile)
      const { error: upsertError } = await supabase
        .from("authnew")
        .upsert([{
          id: data.user.id,
          email,
          name,
          plan_id: null,
        }]);

      if (upsertError) throw upsertError;

      // AsyncStorage ve context güncelle
      await setUser(data.user.id, name);

      showAlert('Success', 'Registration successful! Logging in...');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      showAlert('Error', error.message);
    }
    setLoading(false);
  };

      
  // Giriş işlemi
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'Email and password cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // authnew tablosundan ismi çek
      const { data: userData, error: fetchError } = await supabase
        .from("authnew")
        .select("name")
        .eq("id", data.user.id)
        .single();

      if (fetchError) throw fetchError;

      // AsyncStorage ve context güncelle
      await setUser(data.user.id, userData?.name || '');

      showAlert('Success', 'Login successful.');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      showAlert('Error', error.message);
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
        <View style={styles.darkOverlay} />
        <KeyboardAvoidingView 
          style={styles.keyboard} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.card}>
            <Text style={styles.title}>
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </Text>

            {/* Kayıt modunda isim alanı */}
            {mode === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
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
              placeholder="Password"
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
                {mode === 'login' ? 'Log In' : 'Sıgn Up'}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.smallText}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity 
                onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                <Text style={styles.switchText}>
                  {mode === 'login' ? ' Sign Up' : ' Log In'}
                </Text>
              </TouchableOpacity>
            </View>

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
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.16)" },
  keyboard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#357272de', borderRadius: 12, padding: 20, elevation: 4 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#111' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 10 },
  button: { backgroundColor: '#1b3753ff', padding: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#bebdbdff', fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  smallText: { color: '#333' },
  switchText: { color: '#0c2a47ff', fontWeight: '600' },
});
