import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";

import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

import { Login } from "../screens/Login";
import { StackNavigator } from "../../src/navigation/StackNavigator";
import { useTheme } from "../../src/context/useThemeContext";
import { InitialScreen } from "../../src/screens/InitialScreen";

export function Routes() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { ColorTheme } = useTheme();

  useEffect(() => {
    const onSubscribe = auth.onAuthStateChanged(
      (firebaseUser: FirebaseUser | null) => {
        setUser(firebaseUser);
        setLoading(false);
      }
    );
    return onSubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={ColorTheme.dark} translucent={false} />
        <InitialScreen />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={ColorTheme.dark} translucent={false} />
      {user ? <StackNavigator /> : <Login />}
    </View>
  );
}
