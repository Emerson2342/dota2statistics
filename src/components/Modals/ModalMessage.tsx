import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Linking,
} from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";

export function ModalMessage({
  handleClose,
  message,
  title,
  link,
  matchId,
}: {
  handleClose(): void;
  message: string;
  title: string;
  link?: boolean;
  matchId?: number;
}) {
  const { englishLanguage } = useSettingsContext();

  const openDotaUrl = `https://opendota.com/matches/${matchId?.toString()}`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.textMessage}>
          {"   "}
          {message}
        </Text>
        <TouchableOpacity
          style={{ display: link ? "flex" : "none" }}
          onPress={() => Linking.openURL(openDotaUrl)}
        >
          <Text
            style={{
              marginTop: 15,
              color: "blue",
              textDecorationLine: "underline",
              fontStyle: "italic",
            }}
          >
            {englishLanguage ? "Access OpenDota" : " Acessar OpenDota"}
          </Text>
        </TouchableOpacity>
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
    fontSize: Dimensions.get("screen").width * 0.05,
    fontFamily: "QuickSand-Bold",
    textAlign: "center",
    paddingTop: "2%",
    paddingBottom: "5%",
  },
  textMessage: {
    fontSize: Dimensions.get("screen").width * 0.037,
    color: "#8e8e8e",
    fontFamily: "QuickSand-Semibold",
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#111",
    alignSelf: "center",
    padding: "3%",
    marginTop: "10%",
    borderRadius: 3,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
  },
  textButton: {
    paddingHorizontal: "9%",
    color: "#fff",
    fontFamily: "QuickSand-Bold",
  },
});
