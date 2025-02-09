import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { ThemeColor } from "../../../src/services/props";
import { useTheme } from "../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";

export function ModalExitApp({
  isVisible,
  handleClose,
  handleExitApp,
}: {
  isVisible: boolean;
  handleClose: () => void;
  handleExitApp: () => void;
}) {
  const translateY = useRef(new Animated.Value(300)).current;

  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

  const styles = createStyles(ColorTheme);

  const textMessage = englishLanguage
    ? "Do you really want to exit Dota Statistics?"
    : "Deseja realmente sair do Dota Statistics?";

  const handleCloseAnimated = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => handleClose());
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          width: "100%",
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.textTitle}>{textMessage}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                handleExitApp();
                handleClose();
              }}
              style={styles.button}
            >
              <Text style={styles.textButton}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCloseAnimated()}
              style={[
                styles.button,
                {
                  backgroundColor: "transparent",
                  borderColor: ColorTheme.light,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.textButton, { color: ColorTheme.light }]}>
                Não
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.9)",
    },
    modalContent: {
      width: "100%",
      backgroundColor: colors.dark,
      borderTopLeftRadius: 23,
      borderTopRightRadius: 23,
      padding: "3%",
      alignItems: "center",
    },
    textTitle: {
      fontFamily: "QuickSand-Bold",
      fontSize: 17,
      color: "#fff",
    },
    buttonContainer: {
      width: "100%",
    },
    button: {
      alignItems: "center",
      backgroundColor: colors.light,
      marginTop: "3%",
      borderRadius: 7,
      padding: "3%",
      margin: "3%",
    },
    textButton: {
      fontFamily: "QuickSand-Bold",
      color: "#333",
    },
  });
