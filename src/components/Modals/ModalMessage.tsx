import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";

export function ModalMessage({
  handleClose,
  message,
  title,
}: {
  handleClose(): void;
  message: string;
  title: string;
}) {
  const { englishLanguage } = useSettingsContext();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.textMessage}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleClose()}>
          <Text style={styles.textButton}>
            {englishLanguage ? "Close" : "Fechar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  content: {
    backgroundColor: "#fff",
    padding: "3%",
    borderRadius: 5,
    width: "83%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: Dimensions.get('screen').width * 0.05,
    fontFamily: "QuickSand-Bold",
    textAlign: "center",
    paddingTop: "2%",
    paddingBottom: "5%",
  },
  textMessage: {
    fontSize: Dimensions.get('screen').width * 0.037,
    color: "#8e8e8e",
    fontFamily: "QuickSand-Semibold",
  },
  button: {
    backgroundColor: "#111",
    alignSelf: "center",
    padding: "3%",
    marginTop: "10%",
    borderRadius: 3,
  },
  textButton: {
    paddingHorizontal: "9%",
    color: "#fff",
    fontFamily: "QuickSand-Bold",
  },
});
