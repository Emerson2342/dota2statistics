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

export function TeamFights({
  teamFights,
  heroesId,
}: {
  teamFights: TeamFightModel[] | undefined;
  heroesId: number[];
}) {
  const { englishLanguage } = useSettingsContext();
  const widthImage = Dimensions.get("screen").height * 0.05;

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const itemsArray = Items as Item[];

  const renderItem = ({ item }: { item: TeamFightModel }) => {
    let formattedTime;
    if (item.start) {
      const minute = Math.floor(item.start / 60);
      const seconds = item.start && item.start % 60;

      const formattedHours = String(minute).padStart(2, "0");
      const formattedMinutes = String(seconds).padStart(2, "0");

      formattedTime = `${formattedHours}:${formattedMinutes}`;
    }

    return (
      <View style={styles.renderItemContainer}>
        <Text style={styles.textTime}>
          {englishLanguage ? "Time: " : "Hora: "}
          {formattedTime}
        </Text>

        {item.players?.map((player: PlayerTeamFight, indexPlayer: number) => {
          const teste = heroesId[indexPlayer];

          const heroIndex = heroArray.find((h) => h.id === teste);
          let imgSource = PICTURE_HERO_BASE_URL + heroIndex?.img;

          return (
            <View
              key={indexPlayer}
              style={{
                borderTopWidth: indexPlayer === 0 ? 0 : 1,
                paddingTop: 3,
                paddingBottom: 3,
                borderColor: "#ccc",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  margin: "1%",
                }}
              >
                <View
                  style={{
                    marginRight: 3,
                    alignItems: "flex-start",
                    justifyContent: "center",
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
                <View
                  style={{
                    flexDirection: "row",
                    width: "80%",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.textLabel}>
                      {englishLanguage ? "Damage: " : "Dano Causado: "}
                      <Text style={styles.textData}>
                        {player.damage.toLocaleString(
                          englishLanguage ? "en-US" : "pt-BR"
                        )}
                      </Text>
                    </Text>
                    <Text style={styles.textLabel}>
                      Gold:{" "}
                      <Text
                        style={[
                          styles.textData,
                          { color: player.gold_delta < 0 ? "red" : "#4e9332" },
                        ]}
                      >
                        {player.gold_delta.toLocaleString(
                          englishLanguage ? "en-US" : "pt-BR"
                        )}
                      </Text>
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.textLabel}>
                      Xp:{" "}
                      <Text style={styles.textData}>
                        {player.xp_delta.toLocaleString(
                          englishLanguage ? "en-US" : "pt-BR"
                        )}
                      </Text>
                    </Text>
                    <Text style={styles.textLabel}>
                      {englishLanguage ? "Healing: " : "Cura: "}{" "}
                      <Text style={styles.textData}>
                        {player.healing.toLocaleString(
                          englishLanguage ? "en-US" : "pt-BR"
                        )}
                      </Text>
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.textLabel}>
                      {englishLanguage ? "Deaths" : "Mortes"}{" "}
                      <Text
                        style={[
                          styles.textData,
                          { color: player.deaths == 0 ? "#4e9332" : "red" },
                        ]}
                      >
                        {" "}
                        {player.deaths}
                      </Text>
                    </Text>
                    <Text style={styles.textLabel}>
                      Buybacks:{" "}
                      <Text style={styles.textData}>{player.buybacks}</Text>
                    </Text>
                  </View>
                </View>
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
                      const abilityImage = PICTURE_HERO_BASE_URL + ability?.img;

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
                      const item = itemsArray.find((i) => i.name === itemName);

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
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-start",
                  marginHorizontal: "1%",
                }}
              >
                {Object.entries(player?.killed).map(
                  ([heroName, usageCount]: [string, number], index: number) => {
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
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={teamFights}
        renderItem={renderItem}
        keyExtractor={(item) => item.start.toString()}
        initialNumToRender={3}
      />
    </View>
  );
}
