import React, { useMemo } from "react";
import { View, Text, Image, FlatList, Dimensions } from "react-native";

import { styles } from "./TeamFightsStyle";
import {
  HeroAbilitiesDescriptionsModel,
  PlayerTeamFight,
  TeamFightModel,
} from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";

export function TeamFights({
  teamFights,
  heroNames,
}: {
  teamFights: TeamFightModel[] | undefined;
  heroNames: string[];
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const widthImage = Dimensions.get("screen").height * 0.05;
  const heightBar = Dimensions.get("screen").width * 0.02;

  const renderItem = ({
    item,
    index,
  }: {
    item: TeamFightModel;
    index: number;
  }) => {
    const maxDamage =
      (teamFights ?? [])[index]?.players?.reduce(
        (max, d) => (d.damage > max ? d.damage : max),
        0
      ) ?? 0;

    let formattedTime;
    let endTime;
    if (item.start) {
      const minute = Math.floor(item.start / 60);
      const seconds = item.start && item.start % 60;

      const formattedHours = String(minute).padStart(2, "0");
      const formattedMinutes = String(seconds).padStart(2, "0");

      formattedTime = `${formattedHours}:${formattedMinutes}`;
    }
    if (item.end) {
      const minute = Math.floor(item.end / 60);
      const seconds = item.end && item.end % 60;

      const formattedHours = String(minute).padStart(2, "0");
      const formattedMinutes = String(seconds).padStart(2, "0");

      endTime = `${formattedHours}:${formattedMinutes}`;
    }

    return (
      <View style={[styles.renderItemContainer]}>
        <Text style={styles.textTime}>
          {englishLanguage ? "Time: " : "Hora: "}
          {formattedTime} - {endTime}
        </Text>

        <View style={styles.headerContainer}>
          <Text style={[styles.textLabel, { width: "25%" }]}>
            {englishLanguage ? "Damage Caused" : "Dano Causado"}
          </Text>
          <Text style={[styles.textLabel, { width: "15%" }]}>Gold</Text>
          <Text style={[styles.textLabel, { width: "15%" }]}>
            {englishLanguage ? "Xp Earned" : "Xp Ganho"}
          </Text>
          <Text style={[styles.textLabel, { width: "15%" }]}>
            {englishLanguage ? "Healing" : "Cura"}
          </Text>
          <Text style={[styles.textLabel, { width: "20%" }]}>
            {englishLanguage ? "Deaths" : "Mortes"}
          </Text>
          <Text style={[styles.textLabel, { width: "10%" }]}>BBs</Text>
        </View>

        {item.players?.map((player: PlayerTeamFight, indexPlayer: number) => {
          const heroName = heroNames[indexPlayer];

          let imgSource =
            PICTURE_HERO_BASE_URL +
            "/apps/dota2/images/dota_react/heroes/" +
            heroName +
            ".png?";

          return (
            <View
              key={indexPlayer}
              style={{
                borderTopWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    width: "13%",
                  }}
                >
                  <Image
                    source={{ uri: imgSource }}
                    style={{
                      width: widthImage,
                      aspectRatio: 1.5,
                      borderRadius: 7,
                    }}
                  />
                </View>
                <View style={{ width: "87%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "25%" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={[styles.textData, { width: "35%" }]}>
                          {(item?.players ?? [])[indexPlayer].damage}
                        </Text>
                        <View
                          style={{ width: "65%", justifyContent: "center" }}
                        >
                          <Text
                            style={[
                              styles.textData,
                              {
                                height: heightBar,
                                backgroundColor: "#981a33",
                                borderRadius: 3,
                                width: `${
                                  ((item?.players ?? [])[indexPlayer].damage /
                                    maxDamage) *
                                  100
                                }%`,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.textData,
                        {
                          color: player.gold_delta < 0 ? "red" : "#4e9332",
                          width: "15%",
                        },
                      ]}
                    >
                      {player.gold_delta.toLocaleString(
                        englishLanguage ? "en-US" : "pt-BR"
                      )}
                    </Text>
                    <Text style={[styles.textData, { width: "15%" }]}>
                      {player.xp_delta.toLocaleString(
                        englishLanguage ? "en-US" : "pt-BR"
                      )}
                    </Text>
                    <Text style={[styles.textData, { width: "15%" }]}>
                      {player.healing.toLocaleString(
                        englishLanguage ? "en-US" : "pt-BR"
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.textData,
                        {
                          color: player.deaths == 0 ? "#4e9332" : "red",
                          width: "20%",
                        },
                      ]}
                    >
                      {player.deaths}
                    </Text>
                    <Text style={[styles.textData, { width: "10%" }]}>
                      {player.buybacks}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "flex-start",
                      marginHorizontal: "1%",
                    }}
                  >
                    <View style={[styles.containerImage, { width: "35%" }]}>
                      {Object.entries(player.ability_uses).map(
                        (
                          [abilityName, usageCount]: [string, number],
                          index: number
                        ) => {
                          const abilityImage =
                            ITEM_IMAGE_BASE_URL + abilityName + ".png";

                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: abilityImage }}
                                style={styles.itemImage}
                              />
                            </View>
                          );
                        }
                      )}
                    </View>
                    <View style={[styles.containerImage, { width: "35%" }]}>
                      {Object.entries(player?.item_uses).map(
                        (
                          [itemName, usageCount]: [string, number],
                          index: number
                        ) => {
                          const itemImage =
                            PICTURE_HERO_BASE_URL +
                            "/apps/dota2/images/dota_react/items/" +
                            itemName +
                            ".png";

                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: itemImage }}
                                style={styles.itemImage}
                              />
                            </View>
                          );
                        }
                      )}
                    </View>

                    <View style={[styles.containerImage, { width: "30%" }]}>
                      {Object.entries(player?.killed).map(
                        (
                          [heroName, usageCount]: [string, number],
                          index: number
                        ) => {
                          const clearHeroName = heroName.replace(
                            "npc_dota_hero_",
                            ""
                          );

                          let imgSource =
                            PICTURE_HERO_BASE_URL +
                            "/apps/dota2/images/dota_react/heroes/" +
                            clearHeroName +
                            ".png?";

                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: imgSource }}
                                style={[
                                  styles.itemImage,
                                  {
                                    width:
                                      Dimensions.get("screen").width * 0.057,
                                    aspectRatio: 1.5,
                                  },
                                ]}
                              />
                            </View>
                          );
                        }
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: ColorTheme.light }]}>
      <FlatList
        data={teamFights}
        renderItem={renderItem}
        keyExtractor={(item) => item.start.toString()}
        initialNumToRender={4}
        maxToRenderPerBatch={3}
        windowSize={3}
        scrollEnabled={false}
      />
    </View>
  );
}
