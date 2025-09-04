import React from "react";
import { Alert } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

export default function Teste() {
  const showAlert = (message: string) => {
    Alert.alert(message);
  };

  const panGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX > 50) {
      runOnJS(showAlert)("👉 Arrastou para a direita!");
    } else if (e.translationX < -50) {
      runOnJS(showAlert)("👈 Arrastou para a esquerda!");
    }
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "skyblue",
        }}
      />
    </GestureDetector>
  );
}
