import React, { useEffect, useRef } from "react";
import { SafeAreaView, Animated, Easing, StatusBar } from "react-native";
import { useTheme } from "../../src/context/useThemeContext";

export function SplashScreenComponent({
  onFinish = () => {},
}: {
  onFinish: (isCancelled: boolean) => void;
}) {
  const { ColorTheme } = useTheme();

  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const duration = 3000;

    const rotateAnim = Animated.timing(spin, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const scaleAnim = Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]);

    Animated.parallel([rotateAnim, scaleAnim]).start(() => {
      onFinish(false);
    });
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ColorTheme.dark,
      }}
    >
      <StatusBar backgroundColor={ColorTheme.dark} />
      <Animated.Image
        source={require("../images/logoLogin.png")}
        style={{ width: 100, height: 100, transform: [{ rotate }, { scale }] }}
      />
    </SafeAreaView>
  );
}
