import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "../../src/context/useThemeContext";
import { ThemeColor } from "../../src/services/props";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { TextComponent } from "@src/components/TextComponent";

export function ActivityIndicatorCustom({ message }: { message: string }) {
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  const defaultAnim = useSharedValue<number>(-125);
  const rotate = useSharedValue(0);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [
      { translateY: defaultAnim.value },
      { rotate: `${rotate.value}deg` },
    ],
    margin: 5,
  }));

  useEffect(() => {
    (defaultAnim.value = withTiming(30, {
      duration: 3500,
      easing: Easing.bounce,
    })),
      (rotate.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      ));
  }, []);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Animated.View style={animatedDefault}>
        <Image
          source={require("../images/icon.png")}
          style={{
            width: 75,
            height: 75,
            tintColor: ColorTheme.semidark,
            margin: 5,
          }}
        />
      </Animated.View>
      <TextComponent weight="bold" style={styles.textLoading}>{message}</TextComponent>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    textLoading: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: colors.dark,
      marginBottom: "1%",
    },
  });
