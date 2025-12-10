import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { TextComponent } from "../TextComponent";
import { useSettingsStore } from "@src/store/settings";

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
  const { englishLanguage } = useSettingsStore();

  const openDotaUrl = `https://opendota.com/matches/${matchId?.toString()}`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextComponent weight="bold" style={styles.titleText}>
          {title}
        </TextComponent>
        <TextComponent weight="semibold" style={styles.textMessage}>
          {"   "}
          {message}
        </TextComponent>
        <TouchableOpacity
          style={{ display: link ? "flex" : "none" }}
          onPress={() => Linking.openURL(openDotaUrl)}
        >
          <TextComponent
            style={{
              marginTop: 15,
              color: "blue",
              textDecorationLine: "underline",
              fontStyle: "italic",
            }}
          >
            {englishLanguage ? "Access OpenDota" : " Acessar OpenDota"}
          </TextComponent>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleClose()}>
          <TextComponent weight="bold" style={styles.textButton}>
            {englishLanguage ? "Close" : "Fechar"}
          </TextComponent>
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
    textAlign: "center",
    paddingTop: "2%",
    paddingBottom: "5%",
  },
  textMessage: {
    fontSize: Dimensions.get("screen").width * 0.037,
    color: "#8e8e8e",
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
  },
});
