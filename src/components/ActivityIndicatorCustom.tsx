import React, { memo, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemeColor } from "@src/services/props";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { TextComponent } from "@src/components/TextComponent";
import { useThemeStore } from "@src/store/theme";

function ActivityIndicatorComponent({ message }: { message: string }) {
  const colorTheme = useThemeStore((state) => state.colorTheme);
  const styles = createStyles(colorTheme);

  const rotate = useSharedValue(0);
  const defaultAnim = useSharedValue<number>(-75);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [
      { translateY: defaultAnim.value },
      { rotate: `${rotate.value}deg` },
    ],
    margin: 5,
  }));

  useEffect(() => {
    (defaultAnim.value = withTiming(30, {
      duration: 3000,
      easing: Easing.bounce,
    })),
      (rotate.value = withRepeat(
        withTiming(360, { duration: 2500, easing: Easing.linear }),
        -1
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
            tintColor: colorTheme.semidark,
          }}
        />
      </Animated.View>
      <TextComponent weight="bold" style={styles.textLoading}>
        {message}
      </TextComponent>
    </View>
  );
}

export const ActivityIndicatorCustom = memo(ActivityIndicatorComponent);
ActivityIndicatorCustom.displayName = "ActivityIndicatorCustom";

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    textLoading: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: colors.semidark,
    },
  });
