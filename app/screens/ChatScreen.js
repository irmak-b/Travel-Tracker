import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { fal } from "@fal-ai/client";
import { supabase } from "../supabase";

const { width } = Dimensions.get("window");

export default function ChatScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi there👋 Ask to Compass ." },
  ]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const scrollViewRef = useRef();

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width * 0.8)).current;
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    fetchUser();
  }, []);

  // Chat geçmişini çek
  const loadChatHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chatMessages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setChatHistory(data);
  };

  const toggleDrawer = async () => {
    if (!drawerOpen) await loadChatHistory();

    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? -width * 0.8 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(!drawerOpen));
  };

  const sendMessage = async () => {
    if (!user || !inputText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: inputText }]);
    setLoading(true);

    try {
      const result = await fal.subscribe("fal-ai/any-llm/enterprise", {
        input: { prompt: inputText },
        logs: true,
      });

      const aiMsg = {
        role: "assistant",
        text: result.data?.output ?? "Cevap alınamadı.",
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Supabase'e kaydet
      await supabase.from("chatMessages").insert([
        { user_id: user.id, message: inputText },
      ]);
    } catch (err) {
      console.error("FAL Error:", err);
    } finally {
      setLoading(false);
      setInputText("");
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
      >
        <ImageBackground
          source={require("../assets/chatBack.jpeg")}
          style={styles.ground}
        >
          <ScrollView
            style={styles.chatBox}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.messageBubble,
                  msg.role === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={user ? "Type your request.." : "Please login first..."}
              editable={!!user}
            />
            <Button
              title={loading ? "Sending..." : "SEND"}
              onPress={sendMessage}
              disabled={loading || !user}
            />
            <View style={{ marginTop: 8 }}>
              <Button title="Chats" onPress={toggleDrawer} />
            </View>
          </View>

          {/* Drawer */}
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: drawerAnim }] },
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.drawerTitle}>Chat History</Text>
              <Button title="Close" onPress={toggleDrawer} />
            </View>
            <ScrollView>
              {chatHistory.map((chat, idx) => (
                <View key={idx} style={styles.drawerItem}>
                  <Text style={styles.drawerText}>{chat.message}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          <StatusBar style="auto" />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1 },
  ground: { flex: 1 },
  chatBox: { flex: 1, paddingHorizontal: 16, marginTop: 10, marginBottom: 5 },
  messageBubble: { maxWidth: "75%", padding: 10, borderRadius: 12, marginVertical: 4 },
  userBubble: { backgroundColor: "#277fdd5e", alignSelf: "flex-end", borderTopRightRadius: 0 },
  aiBubble: { backgroundColor: "#34c7598f", alignSelf: "flex-start", borderTopLeftRadius: 0 },
  messageText: { color: "#fff", fontSize: 16 },
  footer: { padding: 10, borderTopWidth: 1, borderColor: "#dddddd2d", backgroundColor: "#ffffff25" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 8, borderRadius: 5 },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.8,
    backgroundColor: "#333",
    padding: 16,
    zIndex: 100,
  },
  drawerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  drawerItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#555" },
  drawerText: { color: "#fff" },
});
