import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Button, StyleSheet, Text, Image, ScrollView, 
  ImageBackground, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Navbar from '../components/ui/Navbar';
import { supabase } from '../supabase';

export default function NoteScreen({ route }) {
  const { id: viewId } = route.params; 
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [planId, setPlanId] = useState(null);

  // Kullanıcıyı al ve plan_id getir
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("authnew")
        .select("plan_id")
        .eq("id", user.id)
        .single();
      if (profileError) console.error(profileError);
      else setPlanId(profile?.plan_id || null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Notları yükle
  const loadNotes = async () => {
    try {
      if (!user) return setSavedNotes([]);
      const { data, error } = await supabase
        .from('newNotes')
        .select('*')
        .eq('view_id', viewId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedNotes(data);
    } catch (e) {
      console.error("Failed to load notes:", e.message);
      Alert.alert("Failed to load notes!", e.message);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  // Not kaydet
  const saveNote = async () => {
    if (!note.trim()) return Alert.alert("Note can't be empty!");
    if (!user) return Alert.alert("Login Required", "You must be logged in to save notes.");

    try {
      let noteLimit = 0;
      let imageLimit = 0;
      let maxImagesPerNote = 1; // default

      if (!planId || planId === "standard") {
        noteLimit = 10;
        imageLimit = 10;
      } else if (planId === "eco") {
        noteLimit = 25;
        imageLimit = 25;
      } else if (planId === "full") {
        noteLimit = Infinity;
        maxImagesPerNote = 15;
      }

      // Not sayısı kontrolü
      const { count, error: countError } = await supabase
        .from("newNotes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("view_id", viewId);

      if (countError) throw countError;

      if (count >= noteLimit) {
        return Alert.alert(
          "Limit Reached",
          `Your plan allows only ${noteLimit} notes in this continent.`
        );
      }

      // Fotoğraf sınırı kontrolü
      if (imageUri) {
        if (planId === "full") {
          const { data: notesWithImages } = await supabase
            .from("newNotes")
            .select("image_uri")
            .eq("user_id", user.id)
            .eq("view_id", viewId);

          const imagesInCurrentNote = notesWithImages.filter(n => n.image_uri).length;
          if (imagesInCurrentNote >= maxImagesPerNote) {
            return Alert.alert(
              "Image Limit Reached",
              `Each note can have up to ${maxImagesPerNote} images for Full plan users.`
            );
          }
        } else {
          const { data: imagesInView } = await supabase
            .from("newNotes")
            .select("image_uri")
            .eq("user_id", user.id)
            .eq("view_id", viewId);

          const totalImages = imagesInView.filter(n => n.image_uri).length;
          if (totalImages >= imageLimit) {
            return Alert.alert(
              "Image Limit Reached",
              `Your plan allows only ${imageLimit} images in this continent.`
            );
          }
        }
      }

      // Notu kaydet
      const { error } = await supabase
        .from('newNotes')
        .insert([{
          user_id: user.id,
          view_id: viewId,
          note_text: note,
          image_uri: imageUri || null,
        }]);

      if (error) throw error;

      setNote("");
      setImageUri(null);
      loadNotes();
      Alert.alert("Note saved!");
    } catch (e) {
      console.error("Failed to save notes:", e.message);
      Alert.alert("Failed to save notes", e.message);
    }
  };

  // Resim seç
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Not sil
  const deleteNote = async (noteId) => {
    try {
      const { error } = await supabase
        .from('newNotes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      loadNotes();
    } catch (e) {
      console.error("Failed to delete note:", e.message);
      Alert.alert("Failed to delete note", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.bigWindow}>
      <ImageBackground 
        source={require("../assets/songround.jpg")} 
        style={styles.ground}
      >
        <Navbar logoSource={require("../assets/newlogo.png")} title={`View ${viewId} Notes`} />

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Road Journal</Text>

          <View style={styles.buttonRow}>
            <Button title="Add Image" onPress={pickImage} />
            <Button title="Save" onPress={saveNote} />
          </View>

          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder={user ? "Type your note here..." : "You must be logged in to save notes."}
            multiline
            editable={!!user}
          />

          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

          {/* Kullanıcıya limit bilgisi göster */}
          {user && planId !== "full" && (
            <Text style={styles.limitInfo}>
              You have used {savedNotes.length}/{planId === "eco" ? 25 : 10} notes in this continent
            </Text>
          )}

          {savedNotes.length > 0 && (
            <View style={{ width: "100%", marginTop: 30 }}>
              <Text style={styles.previousTitle}>Saved Notes</Text>
              {savedNotes.map((item) => (
                <View key={item.id} style={styles.previousNote}>
                  {item.image_uri && (
                    <Image source={{ uri: item.image_uri }} style={styles.previousImage} />
                  )}
                  <Text style={styles.previousText}>{item.note_text}</Text>
                  <View style={styles.delButton}>
                    <Button 
                      title="Delete" 
                      color="rgba(15, 68, 138, 0.97)"
                      onPress={() => deleteNote(item.id)}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bigWindow: { flex: 1, backgroundColor: "#000" },
  ground: { flex: 1, width: '100%', height: '100%', alignItems: 'center' },
  container: { padding: 16, marginTop: 75, backgroundColor: "#3c709be0", alignItems: "center" },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { width: "100%", borderColor: "#0c0b0bea", borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, textAlignVertical: "top", marginBottom: 16, minHeight: 150 },
  image: { width: 300, height: 200, borderRadius: 10, marginBottom: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 },
  limitInfo: { fontSize: 14, fontWeight: "bold", color: "#fff", marginTop: 10, marginBottom: 5 },
  previousTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 25 },
  previousNote: { width: "100%", backgroundColor: "#701e1ebb", padding: 10, borderRadius: 10, marginBottom: 12 },
  previousText: { fontSize: 14, marginTop: 5 },
  previousImage: { width: "100%", height: 150, borderRadius: 10 },
  delButton:{width:65,marginLeft: "auto"},
});
