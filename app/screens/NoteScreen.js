import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView,ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Navbar from '../components/ui/Navbar';

export default function NoteScreen({ route }) {
  const { id } = route.params || { id: 1 };
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  // Not ve resim yükleme
  useEffect(() => {
    const loadNote = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(`note_${id}`);
        if (savedNote !== null) setNote(savedNote);

        const savedImage = await AsyncStorage.getItem(`note_image_${id}`);
        if (savedImage !== null) setImageUri(savedImage);

        const list = await AsyncStorage.getItem(`note_list_${id}`);
        if (list !== null) setSavedNotes(JSON.parse(list));
      } catch (e) { console.log("Not veya resim yüklenemedi", e); }
    };
    loadNote();
  }, [id]);

  // Not kaydetme
    const saveNote = async () => {
        try {
            await AsyncStorage.setItem(`note_${id}`, note);
            if (imageUri) await AsyncStorage.setItem(`note_image_${id}`, imageUri);

            // Daha önceki notları da listeye ekle
            const newNote = { text: note, image: imageUri };
            const updatedList = [newNote, ...savedNotes];
            setSavedNotes(updatedList);
            await AsyncStorage.setItem(`note_list_${id}`, JSON.stringify(updatedList));

            // KAYDETME SONRASI input ve resim temizleme
            setNote("");
            setImageUri(null);

            alert("Not kaydedildi!");
        } catch (e) { 
            console.log("Not kaydedilemedi", e); 
        }
    };
  // Resim seçme
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.bigWindow}>
        <ImageBackground source={require("../assets/songround.jpg")} style={styles.ground}>
            <Navbar logoSource={require("../assets/newlogo.png")} title="Travel Tracker" />
                <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Road Journal {id}</Text>

                <View style={styles.buttonRow}>
                    <Button title="Resim Ekle" onPress={pickImage} />
                    <Button title="Kaydet" onPress={saveNote} />
                </View>

                <TextInput
                    style={styles.input}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Notunuzu buraya yazın..."
                    multiline
                />

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                )}

                

                {/* Daha önce kaydedilmiş notları listeleme */}
                {savedNotes.length > 0 && <Text style={styles.previousTitle}>Önceki Notlar:</Text>}
                {savedNotes.map((item, index) => (
                    <View key={index} style={styles.previousNote}>
                        {item.image && <Image source={{ uri: item.image }} style={styles.previousImage} />}
                        <Text style={styles.previousText}>{item.text}</Text>
                        <Button 
                        title="Sil" 
                        color="rgba(15, 68, 138, 0.97)"
                        onPress={async () => {
                            const updatedList = savedNotes.filter((_, i) => i !== index);
                            setSavedNotes(updatedList);
                            await AsyncStorage.setItem(`note_list_${id}`, JSON.stringify(updatedList));

                            // Eğer silinen not en son kaydedilmiş not ise TextInput ve imageUri’yi temizle
                            if (index === 0) {
                            setNote("");
                            setImageUri(null);
                            await AsyncStorage.removeItem(`note_${id}`);
                            await AsyncStorage.removeItem(`note_image_${id}`);
                            }
                        }}
                        />
                    </View>
                ))}

                </ScrollView>
        </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bigWindow:{flex:1,backgroundColor:"#000"},
  ground:{flex: 1, width: '100%', height: '100%', alignItems: 'center'},
  container: { flexGrow: 0.3, padding: 16,marginTop:75, backgroundColor: "#3c709be0", alignItems: "center" },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { width: "100%", borderColor: "#0c0b0bea", borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, textAlignVertical: "top", marginBottom: 16, minHeight: 150 },
  image: { width: 300, height: 200, borderRadius: 10, marginBottom: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 ,color:"#1a995eff"},
  previousTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 ,marginTop:25},
  previousNote: { width: "100%", backgroundColor: "#701e1ebb", padding: 10, borderRadius: 10, marginBottom: 12 },
  previousText: { fontSize: 14, marginTop: 5 },
  previousImage: { width: "100%", height: 150, borderRadius: 10 }
  
},
);
