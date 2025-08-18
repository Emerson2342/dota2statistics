import React from "react";
import { View, Dimensions, TextInput, Text, StyleSheet } from "react-native";
import { CartesianChart, Line } from "victory-native";
import Animated from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { useSettingsContext } from "../../../context/useSettingsContext";

Animated.addWhitelistedNativeProps({ text: true });

const GraficsGoldAndXpTeam = ({
  radiant_gold_adv,
  radiant_xp_adv,
  RadiantName,
  DireName,
}: {
  radiant_gold_adv: number[];
  radiant_xp_adv: number[];
  RadiantName: string | undefined;
  DireName: string | undefined;
}) => {
  const { englishLanguage } = useSettingsContext();

  const font = useFont(require("../../../Fonts/Quicksand_SemiBold.ttf"));

  const radiantName = RadiantName
    ? RadiantName
    : englishLanguage
    ? "Radiant"
    : "Iluminados";
  const direName = DireName ? DireName : englishLanguage ? "Dire" : "Temidos";

  const combinedData = radiant_gold_adv.map((value, index) => ({
    gold: value,
    xp: radiant_xp_adv[index],
    x: index + 1,
  }));

  const width = Dimensions.get("screen").width * 0.93;

  return (
    <View style={{ width: width, height: 350 }}>
      <Text style={[styles.textGraphic, { color: "green" }]}>
        {radiantName}
      </Text>
      <CartesianChart
        data={combinedData}
        xKey="x"
        yKeys={["gold", "xp"]}
        axisOptions={{
          tickCount: 9,
          font: font,
          labelOffset: { x: 0, y: 0 },
          labelPosition: "outset",
          formatXLabel: (value) => `${value}`,
          formatYLabel: (value) =>
            `${Math.abs(value).toLocaleString(
              englishLanguage ? "en-US" : "pt-BR"
            )}`,
        }}
      >
        {({ points }) => (
          <>
            <Line
              points={points.gold}
              color="#e5c250"
              strokeWidth={1.5}
              curveType="cardinal50"
            />

            <Line
              points={points.xp}
              color="#a3bee0"
              strokeWidth={1.5}
              curveType="cardinal50"
            />
          </>
        )}
      </CartesianChart>
      <Text style={styles.textGraphic}>{direName}</Text>
      <View style={{ marginLeft: "5%" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: "10%", backgroundColor: "#e5c250", height: 5 }}>
            <Text />
          </View>
          <Text style={{ color: "#aaa", fontFamily: "QuickSand-Semibold" }}>
            {" "}
            {englishLanguage ? "Networth" : "Patrimônio Líquido"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: "10%", backgroundColor: "#a3bee0", height: 5 }}>
            <Text />
          </View>
          <Text style={{ color: "#aaa", fontFamily: "QuickSand-Semibold" }}>
            {" "}
            Xp
          </Text>
        </View>
      </View>
    </View>
  );
};

export const GraficsGoldAndXpComponent = React.memo(GraficsGoldAndXpTeam);
GraficsGoldAndXpComponent.displayName = "GraficsGoldAndXpComponent";

const styles = StyleSheet.create({
  textGraphic: {
    textAlign: "center",
    fontSize: 17,
    color: "#ff0000",
    fontFamily: "QuickSand-Semibold",
  },
});
