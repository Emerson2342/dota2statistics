import { FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { TextComponent } from "./TextComponent";

type Props = TextInputProps & {
  label: string;
  isPassword?: boolean;
  showError?: boolean;
};

export function TextInputComponent({
  label,
  value,
  isPassword,
  showError,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    Animated.timing(animated, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 0,
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["#aaa", "#000"],
    }),
    fontFamily: "QuickSand-Semibold",
  };

  return (
    <View style={{ paddingTop: 18, width: "100%" }}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          {...props}
          style={[styles.input]}
          value={value}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#999",
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FontAwesome6 name="eye-slash" size={20} color={"#777"} />
            ) : (
              <FontAwesome6 name="eye" color={"#777"} size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {showError && value === "" && (
        <TextComponent style={styles.textError}>
          Favor Preencher o campo
        </TextComponent>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    color: "#555",
    fontFamily: "QuickSand-Semibold",
    flex: 1,
  },
  textError: {
    fontFamily: "QuickSand-Semibold",
    fontSize: 10,
    color: "#ff0000",
  },
});
