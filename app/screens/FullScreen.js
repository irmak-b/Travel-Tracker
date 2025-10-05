import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { adapty } from "react-native-adapty";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '../supabase'; // Supabase client

const androidFallback = require("../assets/android_fallback.json");
const PLACEMENT_ID = "on_tap_economy";
const { width } = Dimensions.get("window");

const CAROUSEL_DATA = [
  { id: "1", emoji: "📰", text: "Unlimited Road Journal per Continent!" },
  { id: "2", emoji: "📒", text: "Add up to 10 photos!" },
  { id: "3", emoji: "🗺️", text: "Unlimited AI Guide!" }
];

export default function FullScreen() {
  const navigation = useNavigation(); 

  const [loading, setLoading] = useState(false);
  const [paywall, setPaywall] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  // Kullanıcıyı Supabase’den al
  const fetchUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser); // null ise giriş yok
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  useEffect(() => {
    const loadPaywall = async () => {
      try {
        adapty.setFallback(androidFallback);
        const pw = await adapty.getPaywall(PLACEMENT_ID);
        setPaywall(pw);
      } catch (err) {
        console.error("Paywall yüklenemedi:", err);
      }
    };
    loadPaywall();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= CAROUSEL_DATA.length) nextIndex = 0;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePurchase = async () => {
  if (!user) {
    Alert.alert(
      "Login Required",
      "You have to login first to purchase.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: () => navigation.navigate("AuthScreen") }
      ]
    );
    return;
  }

  try {
    // authnew tablosunda plan_id güncelle
    const { error } = await supabase
      .from("authnew")
      .update({ plan_id: "full" })
      .eq("id", user.id); // burada user.id = register sırasında kaydettiğin UUID

    if (error) throw error;

    Alert.alert(
    "Success",
    "Full Pack purchase simulated!\nPlan ID 'full' has been saved.",
    [{ text: "OK" }]
);

  } catch (err) {
    console.error("Plan update failed", err);
    Alert.alert("Error", "A problem accoured.");
  }
};


  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index || 0);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.productText}>{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B5CAF" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/login.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Full Pack</Text>
          <Text style={styles.headerSubtitle}>"Full Acces to Every Feauture"</Text>
        </View>

        <View style={styles.productCard}>
          <FlatList
            ref={flatListRef}
            data={CAROUSEL_DATA}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            snapToInterval={width * 0.85}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          />

          <View style={styles.dotsContainer}>
            {CAROUSEL_DATA.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>

          <Text style={styles.priceText}>
            {paywall?.products?.[0]?.localizedPrice || "$11.99/year"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.purchaseBtn}
          onPress={handlePurchase}
          activeOpacity={0.8}
        >
          <Text style={styles.purchaseBtnText}>PURCHASE</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => Alert.alert("Terms")}>
            <Text style={styles.footerText}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Privacy")}>
            <Text style={styles.footerText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AuthScreen")}>
            <Text style={styles.footerText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.16)" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  contentContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  headerContainer: { backgroundColor: "#635a8f96", width: width * 0.85, paddingVertical: 20, paddingHorizontal: 20, borderRadius: 19, alignItems: "center", marginBottom: 30 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", marginBottom: 4, textAlign: "center" },
  headerSubtitle: { fontSize: 12, color: "#FFFFFF", fontStyle: "italic", opacity: 0.9, textAlign: "center" },
  productCard: { backgroundColor: "#4e2728a8", width: width * 0.85, paddingVertical: 18, alignItems: "center", borderRadius: 19 },
  carouselContent: { alignItems: "center" },
  carouselItem: { width: width * 0.85, height: 80, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
  emoji: { fontSize: 28, marginBottom: 6, marginRight: "auto" },
  productText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF", marginRight: "auto", lineHeight: 18 },
  dotsContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 8, marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255, 255, 255, 0.4)", marginHorizontal: 3 },
  activeDot: { backgroundColor: "#FFFFFF", width: 8, height: 8, borderRadius: 4 },
  priceText: { fontSize: 13, color: "#FFFFFF", marginTop: 4, fontWeight: "500", textAlign: "center" },
  purchaseBtn: { backgroundColor: "#1c3f63c7", width: width * 0.85, paddingVertical: 14, alignItems: "center", justifyContent: "center", marginTop: 18, borderRadius: 8 },
  purchaseBtnText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1.2, textAlign: "center" },
  footerContainer: { flexDirection: "row", justifyContent: "space-evenly", width: width * 0.85, marginTop: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.25)" },
  footerText: { fontSize: 12, color: "#FFFFFF", textDecorationLine: "underline", textAlign: "center" },
});