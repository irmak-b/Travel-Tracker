import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const PLANS = [
  {
    id: "standart",
    name: "Standard Plan",
    price: "FREE",
    features: [
      "📰 10 Road Journal per Continent",
      "📷 1 Image per Journal",
      "🗺️ Basic Features",
    ],
    color: "#4A90E2",
  },
  {
    id: "eco",
    name: "Economy Plan",
    price: "$9.99/year",
    features: [
      "📰 25 Road Journal per Continent",
      "📷 5 Images per Journal",
      "🗺️ Unlimited AI Guide",
    ],
    color: "#F5A623",
    popular: true,
  },
  {
    id: "full",
    name: "Full Plan",
    price: "$19.99/year",
    features: [
      "📰 Unlimited Journals per Continent",
      "📷 10 Images per Journal",
      "🗺️ Premium AI Features",
      "⭐ Priority Support",
    ],
    color: "#7B68EE",
  },
];

export default function PlanSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(route.params?.planId || "eco");

  const handlePurchase = async () => {
    try {
      setLoading(true);

      // Kullanıcıyı al
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert("Error", "Please login first!");
        navigation.navigate("AuthScreen");
        return;
      }

      // Mock ödeme işlemi
      await new Promise(resolve => setTimeout(resolve, 1500));

      // plan_id'yi Supabase'e kaydet
      const { error } = await supabase
        .from("users")
        .update({ plan_id: selectedPlan })
        .eq("id", user.id);

      if (error) throw error;

      Alert.alert(
        "Success! 🎉",
        `${PLANS.find(p => p.id === selectedPlan)?.name} activated!`,
        [
          {
            text: "Start Using",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/login.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>
            Select the perfect plan for your journey
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
                { borderColor: plan.color },
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={[styles.planPrice, { color: plan.color }]}>
                  {plan.price}
                </Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <Text key={index} style={styles.featureText}>
                    {feature}
                  </Text>
                ))}
              </View>

              {selectedPlan === plan.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.purchaseBtn,
            loading && styles.purchaseBtnDisabled,
          ]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.purchaseBtnText}>
            {loading ? "Processing..." : "CONTINUE"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "transparent",
    position: "relative",
  },
  selectedPlanCard: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 3,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    backgroundColor: "#F5A623",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "700",
  },
  featuresContainer: {
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.95,
    lineHeight: 20,
  },
  checkmark: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  purchaseBtn: {
    backgroundColor: "#4CAF50",
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 16,
  },
  purchaseBtnDisabled: {
    backgroundColor: "#999999",
  },
  purchaseBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backBtnText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
});