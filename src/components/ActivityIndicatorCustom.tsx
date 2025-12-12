import React, { memo, useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useTheme } from "@src/context/useThemeContext";
import { ThemeColor } from "@src/services/props";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { TextComponent } from "@src/components/TextComponent";

function ActivityIndicatorComponent({ message }: { message: string }) {
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  const rotate = useSharedValue(0);
  const defaultAnim = useSharedValue<number>(0);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
    margin: 5,
  }));

  useEffect(() => {
    (defaultAnim.value = withTiming(30, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })),
      (rotate.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
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
      <ActivityIndicator size="large" color={ColorTheme.semidark} />
      {/* <Animated.View style={animatedDefault}>
        <Image
          source={require("../images/icon.png")}
          style={{
            width: 75,
            height: 75,
            tintColor: ColorTheme.semidark,
          }}
        />
      </Animated.View> */}
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
