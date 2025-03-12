import React, { useState } from "react";
import {
  View,
  Dimensions,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CartesianChart, Line } from "victory-native";
import Animated from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { useSettingsContext } from "../../context/useSettingsContext";
import {
  HeroDetailsModel,
  MatchDetailsModel,
} from "../../../src/services/props";
import {
  PICTURE_HERO_BASE_FULL_URL,
  PICTURE_HERO_BASE_URL,
} from "../../../src/constants/player";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";

Animated.addWhitelistedNativeProps({ text: true });

export const GraficsGoldPlayers = ({
  matchDetails,
  RadiantName,
  DireName,
}: {
  matchDetails: MatchDetailsModel;
  RadiantName: string | undefined;
  DireName: string | undefined;
}) => {
  const { englishLanguage } = useSettingsContext();

  const [hero1Selected, setHero1Selected] = useState(true);
  const [hero2Selected, setHero2Selected] = useState(false);
  const [hero3Selected, setHero3Selected] = useState(false);
  const [hero4Selected, setHero4Selected] = useState(false);
  const [hero5Selected, setHero5Selected] = useState(false);
  const [hero6Selected, setHero6Selected] = useState(true);
  const [hero7Selected, setHero7Selected] = useState(false);
  const [hero8Selected, setHero8Selected] = useState(false);
  const [hero9Selected, setHero9Selected] = useState(false);
  const [hero10Selected, setHero10Selected] = useState(false);

  const font = useFont(require("../../Fonts/Quicksand_SemiBold.ttf"));

  const player1 = matchDetails.players[0].gold_t ?? [];
  const player2 = matchDetails.players[1].gold_t ?? [];
  const player3 = matchDetails.players[2].gold_t ?? [];
  const player4 = matchDetails.players[3].gold_t ?? [];
  const player5 = matchDetails.players[4].gold_t ?? [];
  const player6 = matchDetails.players[5].gold_t ?? [];
  const player7 = matchDetails.players[6].gold_t ?? [];
  const player8 = matchDetails.players[7].gold_t ?? [];
  const player9 = matchDetails.players[8].gold_t ?? [];
  const player10 = matchDetails.players[9].gold_t ?? [];

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
  const combinedData = player1.map((value, index) => ({
    x: index + 1,
    player1: value,
    player2: player2[index],
    player3: player3[index],
    player4: player4[index],
    player5: player5[index],
    player6: player6[index],
    player7: player7[index],
    player8: player8[index],
    player9: player9[index],
    player10: player10[index],
  }));

  const colors = [
    "#FF5733",
    "#3366FF",
    "#33FF57",
    "#FF33A8",
    "#FFD700",
    "#800080",
    "#00CED1",
    "#FF4500",
    "#008000",
    "#8B0000",
  ];

  const colorHero1 = hero1Selected ? colors[0] : "transparent";
  const colorHero2 = hero2Selected ? colors[1] : "transparent";
  const colorHero3 = hero3Selected ? colors[2] : "transparent";
  const colorHero4 = hero4Selected ? colors[3] : "transparent";
  const colorHero5 = hero5Selected ? colors[4] : "transparent";
  const colorHero6 = hero6Selected ? colors[5] : "transparent";
  const colorHero7 = hero7Selected ? colors[6] : "transparent";
  const colorHero8 = hero8Selected ? colors[7] : "transparent";
  const colorHero9 = hero9Selected ? colors[8] : "transparent";
  const colorHero10 = hero10Selected ? colors[9] : "transparent";

  const width = Dimensions.get("screen").width * 0.93;

  const handleSelectHero = (index: number) => {
    if (index === 0) {
      setHero1Selected(!hero1Selected);
    }
    if (index === 1) {
      setHero2Selected(!hero2Selected);
    }
    if (index === 2) {
      console.log(index);
      setHero3Selected(!hero3Selected);
    }
    if (index === 3) {
      console.log(index);
      setHero4Selected(!hero4Selected);
    }
    if (index === 4) {
      console.log(index);
      setHero5Selected(!hero5Selected);
    }
    if (index === 5) {
      console.log(index);
      setHero6Selected(!hero6Selected);
    }
    if (index === 6) {
      console.log(index);
      setHero7Selected(!hero7Selected);
    }
    if (index === 7) {
      console.log(index);
      setHero8Selected(!hero8Selected);
    }
    if (index === 8) {
      console.log(index);
      setHero9Selected(!hero9Selected);
    }
    if (index === 9) {
      console.log(index);
      setHero10Selected(!hero10Selected);
    }
  };

  return (
    <View style={{ width: width, height: 350 }}>
      <Text style={[styles.textGraphic, { color: "green" }]}>
        {RadiantName}
      </Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {matchDetails.players.slice(0, 5).map((player, index) => {
          const hero = heroArray.find((hero) => hero.id === player.hero_id);
          const borderColor = colors[index];

          const heroImage = PICTURE_HERO_BASE_URL + hero?.img;
          return (
            <View key={index}>
              <TouchableOpacity onPress={() => handleSelectHero(index)}>
                <Image
                  src={heroImage}
                  style={{
                    borderWidth: 1.7,
                    borderColor: borderColor,
                    width: width * 0.1,
                    borderRadius: 37,
                    aspectRatio: 1,
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <CartesianChart
        data={combinedData}
        xKey="x"
        yKeys={[
          "player1",
          "player2",
          "player3",
          "player4",
          "player5",
          "player6",
          "player7",
          "player8",
          "player9",
          "player10",
        ]}
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
              points={points.player1}
              color={colorHero1}
              strokeWidth={1.3}
              curveType="cardinal50"
            />

            <Line
              points={points.player2}
              color={colorHero2}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player3}
              color={colorHero3}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player4}
              color={colorHero4}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player5}
              color={colorHero5}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player6}
              color={colorHero6}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player7}
              color={colorHero7}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player8}
              color={colorHero8}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player9}
              color={colorHero9}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
            <Line
              points={points.player10}
              color={colorHero10}
              strokeWidth={1.3}
              curveType="cardinal50"
            />
          </>
        )}
      </CartesianChart>
      <Text style={styles.textGraphic}>{DireName}</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {matchDetails.players.slice(5, 10).map((player, index) => {
          const hero = heroArray.find((hero) => hero.id === player.hero_id);

          const heroImage = PICTURE_HERO_BASE_URL + hero?.img;
          const borderColor = colors[index + 5];
          return (
            <View key={index}>
              <TouchableOpacity onPress={() => handleSelectHero(index + 5)}>
                <Image
                  src={heroImage}
                  style={{
                    borderWidth: 1.7,
                    borderColor: borderColor,
                    width: width * 0.1,
                    borderRadius: 37,
                    aspectRatio: 1,
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          setHero1Selected(false);
          setHero2Selected(false);
          setHero3Selected(false);
          setHero4Selected(false);
          setHero5Selected(false);
          setHero6Selected(false);
          setHero7Selected(false);
          setHero8Selected(false);
          setHero9Selected(false);
          setHero10Selected(false);
        }}
        style={{
          alignSelf: "center",
          marginTop: 17,
          backgroundColor: "#f13e3e",
          borderRadius: 7,
        }}
      >
        <Text
          style={{ padding: 7, color: "#fff", fontFamily: "QuickSand-Bold" }}
        >
          {englishLanguage ? "Clear Graphic" : "Limpar Gráfico"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textGraphic: {
    textAlign: "center",
    fontSize: 17,
    color: "#ff0000",
    fontFamily: "QuickSand-Semibold",
  },
});
