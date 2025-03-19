import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  useWindowDimensions,
  ListRenderItem,
} from "react-native";

import { styles } from "./TeamFightsStyle";
import {
  HeroAbilitiesDescriptionsJson,
  HeroAbilitiesDescriptionsModel,
  HeroDetailsModel,
  Item,
  PlayerTeamFight,
  TeamFightModel,
} from "../../../src/services/props";
import Items from "../../components/Itens/itemsList.json";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import AbililitiesDescription from "../../components/Heroes/AbilitiesDescriptions.json";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";
import { BannerAds } from "../../../src/components/BannerAds";

export function TeamFights({
  teamFights,
  heroesId,
}: {
  teamFights: TeamFightModel[] | undefined;
  heroesId: number[];
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const widthImage = Dimensions.get("screen").height * 0.05;

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const heroMap = useMemo(() => {
    return heroArray.reduce((acc, hero) => {
      acc[hero.id] = hero;
      return acc;
    }, {} as Record<number, HeroDetailsModel>);
  }, [heroArray]);

  const itemsArray = Items as Item[];

  const renderItem = ({ item }: { item: TeamFightModel }) => {
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
          const teste = heroesId[indexPlayer];

          const heroIndex = heroMap[teste];
          let imgSource = PICTURE_HERO_BASE_URL + heroIndex?.img;

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
                    <Text style={[styles.textData, { width: "25%" }]}>
                      {player.damage.toLocaleString(
                        englishLanguage ? "en-US" : "pt-BR"
                      )}
                    </Text>
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
                    <View style={styles.containerImage}>
                      {Object.entries(player.ability_uses).map(
                        (
                          [abilityName, usageCount]: [string, number],
                          index: number
                        ) => {
                          const ability: HeroAbilitiesDescriptionsModel =
                            AbililitiesDescription[
                              abilityName as keyof typeof AbililitiesDescription
                            ];
                          const abilityImage =
                            PICTURE_HERO_BASE_URL + ability?.img;

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
                    <View style={styles.containerImage}>
                      {Object.entries(player?.item_uses).map(
                        (
                          [itemName, usageCount]: [string, number],
                          index: number
                        ) => {
                          const item = itemsArray.find(
                            (i) => i.name === itemName
                          );

                          const itemImage = PICTURE_HERO_BASE_URL + item?.img;

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

              <View
                style={{
                  width: "98%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginHorizontal: "1%",
                  display:
                    Object.entries(player?.killed).length > 0 ? "none" : "none",
                }}
              >
                <Text style={styles.textLabel}>
                  {englishLanguage ? "Heroes Killed" : "Heróis Mortos"}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {Object.entries(player?.killed).map(
                    (
                      [heroName, usageCount]: [string, number],
                      index: number
                    ) => {
                      const clearHeroName = heroName.replace(
                        "npc_dota_hero_",
                        ""
                      );

                      const item = heroArray.find(
                        (i) => i.name === clearHeroName
                      );

                      const itemImage = PICTURE_HERO_BASE_URL + item?.img;

                      return (
                        <View
                          key={index}
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{ uri: itemImage }}
                            style={[
                              styles.itemImage,
                              { width: widthImage * 0.7, aspectRatio: 1.5 },
                            ]}
                          />
                        </View>
                      );
                    }
                  )}
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
        initialNumToRender={10}
        scrollEnabled={false}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}
