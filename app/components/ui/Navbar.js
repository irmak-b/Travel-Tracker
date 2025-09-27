import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Navbar({ logoSource, title }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      
      <View style={styles.left}>
        <Image source={logoSource} style={styles.logo} />
      </View>

    
      <View style={styles.center}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

     
      <View style={styles.right}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("WindowScreen")}>
              <Text style={styles.menuText}>🏠 Anasayfa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ProfileScreen") }>
              <Text style={styles.menuText}>👤 Hesap</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    backgroundColor: 'rgba(163, 45, 29, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  left: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 70,
    marginRight: 15,
    paddingVertical: 10,
    width: 160,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

