import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { useSettingsContext } from "@src/context/useSettingsContext";
import { TextComponent } from "@src/components/TextComponent";

const width = Dimensions.get("screen").width * 0.93;

const GraficsGoldAndXpTeam = ({
  radiant_gold_adv,
  radiant_xp_adv,
  radName,
  direName,
}: {
  radiant_gold_adv: number[];
  radiant_xp_adv: number[];
  radName: string | undefined;
  direName: string | undefined;
}) => {
  const { englishLanguage } = useSettingsContext();

  const font = useFont(require("../../../Fonts/Quicksand_SemiBold.ttf"));

  const combinedData = radiant_gold_adv.map((value, index) => ({
    gold: value,
    xp: radiant_xp_adv[index],
    x: index + 1,
  }));

  return (
    <View style={{ width: width, height: 350 }}>
      <TextComponent
        weight="semibold"
        style={[styles.textGraphic, { color: "green" }]}
      >
        {radName}
      </TextComponent>
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
      <TextComponent weight="semibold" style={styles.textGraphic}>
        {direName}
      </TextComponent>
      <View style={{ marginLeft: "5%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <View
            style={{ width: "10%", backgroundColor: "#e5c250", height: 5 }}
          />

          <TextComponent weight="semibold" style={{ color: "#aaa" }}>
            {englishLanguage ? "Networth" : "Patrimônio Líquido"}
          </TextComponent>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <View
            style={{ width: "10%", backgroundColor: "#a3bee0", height: 5 }}
          />
          <TextComponent weight="semibold" style={{ color: "#aaa" }}>
            Xp
          </TextComponent>
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
  },
});
