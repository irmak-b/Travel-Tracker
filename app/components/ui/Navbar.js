import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image,Modal, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { UserContext } from "../../UserContext";
import SideDrawer from "./SideDrawer";

export default function Navbar({ logoSource, title }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useContext(UserContext);
  const [displayName, setDisplayName] = useState(title);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const drawerWidth = screenWidth * 0.8;
  const drawerAnim = useState(new Animated.Value(-drawerWidth))[0]; 



  useEffect(() => {
    if (user?.name) setDisplayName(user.name);
    else setDisplayName(title);
  }, [user, title]);

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -drawerWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerVisible(false));
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <TouchableOpacity style={styles.left} onPress={openDrawer}>
        <Image source={logoSource} style={styles.logo} />
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.center}>
        <Text style={styles.title}>{displayName}</Text>
      </View>
     
      {/* Menu */}
      <View style={styles.right}> 
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}> 
          <Text style={styles.menuIcon}>☰</Text> 
        </TouchableOpacity> 
      </View> 

      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}> 
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)}> 
          <View style={styles.menu}> 
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("WindowScreen")}> 
              <Text style={styles.menuText}>🏠 Home</Text> 
            </TouchableOpacity> 
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ProfileScreen")}> 
              <Text style={styles.menuText}>👤 Account</Text> 
            </TouchableOpacity> 
          </View> 
        </TouchableOpacity> 
      </Modal> 

      {/* Drawer */}
      {drawerVisible && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.overlayTouchable} onPress={closeDrawer} />
          <Animated.View style={[styles.drawerContainer, { left: drawerAnim }]}>
            <SideDrawer onClose={closeDrawer} />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    backgroundColor: "rgba(163, 45, 29, 0.55)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  left: { flex: 1, justifyContent: "flex-start" },
  center: { flex: 2, alignItems: "center" },
  right: { flex: 1, alignItems: "flex-end" },
  logo: { width: 55, height: 55, resizeMode: "contain" },
  title: { color: "#fff", fontSize: 18 },
  menuButton: { padding: 10 },
  menuIcon: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end' }, 
  menu: { backgroundColor: '#fff', borderRadius: 8, marginTop: 70, marginRight: 15, paddingVertical: 10, width: 160, elevation: 5 }, 
  menuItem: { paddingVertical: 12, paddingHorizontal: 15 }, 
  menuText: { fontSize: 16, color: '#333' }, 

  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    zIndex: 20,
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  drawerContainer: {
  position: "absolute", 
  top: 0,
  bottom: 0,
  width: "80%",
  backgroundColor: "#fff",
  elevation: 10,
  height: 700,
},

}); 