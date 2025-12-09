import React from "react";
import { Image, View } from "react-native";
import { TextComponent } from "./TextComponent";
import { useSettingsContext } from "@src/context/useSettingsContext";

type Props = {
  englishName: string;
  portugueseName: string;
};

export function SantaHatComponent({ englishName, portugueseName }: Props) {
  const { englishLanguage } = useSettingsContext();
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TextComponent weight="semibold" style={{ color: "#fff", fontSize: 20 }}>
        {englishLanguage ? englishName : portugueseName}
      </TextComponent>
      <Image
        source={require("@src/images/santaHat.png")}
        style={{
          width: 30,
          height: 30,
          marginLeft: -17,
          marginTop: -10,
        }}
      />
    </View>
  );
}
