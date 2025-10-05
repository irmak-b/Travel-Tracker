import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // başlangıçta null

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("currentUser");
      const name = await AsyncStorage.getItem("currentUserName");
      if (id && name) setUser({ id, name });
    };
    loadUser();
  }, []);

  const updateUser = async (id, name) => {
    await AsyncStorage.setItem("currentUser", id);
    await AsyncStorage.setItem("currentUserName", name);
    setUser({ id, name });
  };

  const logout = async () => {
    await AsyncStorage.removeItem("currentUser");
    await AsyncStorage.removeItem("currentUserName");
    setUser(null); // logout'ta null yap
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
