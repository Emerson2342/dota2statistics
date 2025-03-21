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
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
  const iconSize = Dimensions.get("screen").width * 0.037;

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

          <View style={{ alignItems: "center", width: "19%" }}>
            <MaterialCommunityIcons
              name="sword"
              size={iconSize}
            />
          </View>
          <View style={{ alignItems: "center", width: "15%" }}>
            <FontAwesome5
              name="coins"
              size={iconSize}
              color={"#C99700"}
            />
          </View>
          <View style={{ alignItems: "center", width: "15%" }}>
            <MaterialCommunityIcons
              name="arrow-up-bold-box"
              size={iconSize}
              color={"green"}
            />
          </View>
          <View style={{ alignItems: "center", width: "10%" }}>
            <FontAwesome5
              name="plus-circle"
              size={iconSize}
              color={"green"}
            />
          </View>
          <View style={{ alignItems: "center", width: "7%" }}>
            <Ionicons size={iconSize} name="skull" color={"#A60000"} />
          </View>
          <View style={{ alignItems: "center", width: "17%" }}>
            <Text style={styles.textLabel}>Skills</Text>
          </View>
          <View style={{ alignItems: "center", width: "17%" }}>
            <Text style={styles.textLabel}>{englishLanguage ? "Items" : "Itens"}</Text>
          </View>
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
                    alignItems: "center",
                    justifyContent: "center",
                    width: "13%",
                  }}
                >
                  <Image
                    source={{ uri: imgSource }}
                    style={{
                      width: widthImage,
                      aspectRatio: 1.5,
                      borderRadius: 3,
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
                    <View style={{ width: "19%" }}>
                      <Text style={[styles.textData, { textAlign: 'left' }]}>
                        {(item?.players ?? [])[indexPlayer].damage.toLocaleString(englishLanguage ? "en-us" : "pt-BR")}
                      </Text>
                      <View
                        style={{ justifyContent: "center" }}
                      >
                        <Text
                          style={[
                            styles.textData,
                            {
                              backgroundColor: "#981a33",
                              borderRadius: 3,
                              width: `${((item?.players ?? [])[indexPlayer].damage /
                                maxDamage) *
                                100
                                }%`,
                            },
                          ]}
                        />
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
                    <Text style={[styles.textData, { width: "10%" }]}>
                      {player.healing.toLocaleString(
                        englishLanguage ? "en-US" : "pt-BR"
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.textData,
                        {
                          color: player.deaths == 0 ? "#4e9332" : "red",
                          width: "7%",
                        },
                      ]}
                    >
                      {player.deaths}
                    </Text>
                    <View style={[styles.containerImage, { width: "17%" }]}>
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
                    <View style={[styles.containerImage, { width: "17%" }]}>
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

                  </View>

                </View>
              </View>
              <View style={[styles.containerImage, { width: "87%", alignSelf: "flex-end" }]}>
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
                          style={styles.itemImage}
                        />
                      </View>
                    );
                  }
                )}
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
