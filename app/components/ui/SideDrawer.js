import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserContext } from "../../UserContext";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../supabase";

export default function SideDrawer({ onClose }) {
  const { user, logout } = useContext(UserContext);
  const navigation = useNavigation();
  const [planId, setPlanId] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("authnew")
        .select("plan_id")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Failed to fetch plan:", error);
      } else {
        setPlanId(data?.plan_id || "standard");
      }
    };
    fetchPlan();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigation.replace("AuthScreen");
  };

  const handleLogin = () => {
    onClose();
    navigation.navigate("AuthScreen");
  };

  const getPlanName = () => {
    switch (planId) {
      case "eco": return "Eco Plan";
      case "full": return "Full Plan";
      case "standard":
      default: return "Standard Plan";
    }
  };

  return (
    <View style={styles.drawer}>
      {user ? (
        <>
          <Text style={styles.title}>Hi, {user?.name || "User"}</Text>
          <Text style={styles.planText}>Your Plan: {getPlanName()}</Text>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>LOG OUT</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Hi there!</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </>
      )}

      {/* En alta Close Drawer butonu */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Drawer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: "#6ba186b9",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  planText: { fontSize: 16, fontWeight: "600", marginBottom: 20 },
  button: {
    backgroundColor: "#68160dd3",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" },
  closeButton: {
    marginTop: "auto", // en alta yapar
    backgroundColor: "#122c3dff",
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
