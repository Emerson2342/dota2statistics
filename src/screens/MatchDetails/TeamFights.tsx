import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  processColor,
} from "react-native";

import { createStyles } from "./TeamFightsStyle";
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
import { BarCarComponent } from "./BarCharComponent";

const GREEN = processColor("#71BD6A");
const RED = processColor("#D14B5A");
const GOLD = processColor("#DAA520");
const BLUE = processColor("#219FD5");

export function TeamFights({
  teamFights,
  heroNames,
  radTeamName,
  direTeamName,
}: {
  teamFights: TeamFightModel[] | undefined;
  heroNames: string[];
  radTeamName: string;
  direTeamName: string;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);
  const widthImage = Dimensions.get("screen").height * 0.03;

  const iconSize = Dimensions.get("screen").width * 0.037;

  const renderItem = ({
    item,
    index,
  }: {
    item: TeamFightModel;
    index: number;
  }) => {
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

    const damageArray = item.players?.map((h) => h.damage) || [];

    const goldArray = item.players?.map((h) => h.gold_delta) || [];

    const xpArray = item.players?.map((h) => h.xp_delta) || [];

    const healingArray = item.players?.map((h) => h.healing) || [];

    const formattedDataDamageRad = damageArray
      .slice(0, 5)
      .map((value) => ({ y: value }));

    const formattedDataDamageDire = damageArray
      .slice(5, 10)
      .map((value) => ({ y: value }));

    const formattedDataGoldRad = goldArray
      .slice(0, 5)
      .map((value) => ({ y: value }));

    const formattedDataXpRad = xpArray
      .slice(0, 5)
      .map((value) => ({ y: value }));
    const formattedDataXpDire = xpArray
      .slice(0, 5)
      .map((value) => ({ y: value }));

    const formttedDataGoldDire = goldArray
      .slice(5, 10)
      .map((value) => ({ y: value }));

    const formattedHealingRad = healingArray
      .slice(0, 5)
      .map((value) => ({ y: value }));
    const formattedHealingDire = healingArray
      .slice(5, 10)
      .map((value) => ({ y: value }));

    return (
      <View style={[styles.renderItemContainer]}>
        <Text style={styles.textTime}>
          {englishLanguage ? "Time: " : "Hora: "}
          {formattedTime} - {endTime}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text>{radTeamName}</Text>
            <View>
              <View style={{ flexDirection: "row" }}>
                {item.players
                  ?.slice(0, 5)
                  .map((player: PlayerTeamFight, indexPlayer: number) => {
                    const heroName = heroNames[indexPlayer];

                    let imgSource =
                      PICTURE_HERO_BASE_URL +
                      "/apps/dota2/images/dota_react/heroes/" +
                      heroName +
                      ".png?";

                    return (
                      <View key={indexPlayer}>
                        <Image
                          source={{ uri: imgSource }}
                          style={{
                            width: widthImage,
                            height: widthImage,
                            borderRadius: 3,
                            marginHorizontal: 1,
                          }}
                        />
                      </View>
                    );
                  })}
              </View>
              <View
                style={{ width: "100%", paddingTop: "7%", paddingBottom: "7%" }}
              >
                <BarCarComponent
                  formattedData={formattedDataDamageRad}
                  color={RED}
                />
              </View>
              <View
                style={{ width: "100%", paddingTop: "7%", paddingBottom: "7%" }}
              >
                <BarCarComponent
                  formattedData={formattedDataXpRad}
                  color={GREEN}
                />
              </View>
              <View
                style={{ width: "100%", paddingTop: "7%", paddingBottom: "7%" }}
              >
                <BarCarComponent
                  formattedData={formattedDataGoldRad}
                  color={GOLD}
                />
              </View>
              {/* <View style={{ width: "100%", paddingTop: "7%" }}>
                <BarCarComponent
                  formattedData={formattedHealingRad}
                  color={BLUE}
                />
              </View> */}
              <Text style={styles.textLabel}>
                {englishLanguage ? "Abilities" : "Habilidades"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {item.players
                  ?.slice(0, 5)
                  .map((player: PlayerTeamFight, indexPlayer: number) => {
                    const abilities = Object.entries(player.ability_uses);

                    if (abilities.length === 0)
                      return <View style={styles.itemImage} />;

                    return (
                      <View key={indexPlayer}>
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
                    );
                  })}
              </View>
              <Text style={styles.textLabel}>
                {englishLanguage ? "Items" : "Itens"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {item.players
                  ?.slice(0, 5)
                  .map((player: PlayerTeamFight, indexPlayerItem: number) => {
                    const items = Object.entries(player.item_uses);

                    if (items.length === 0)
                      return (
                        <View
                          key={indexPlayerItem + 331}
                          style={styles.itemImage}
                        />
                      );

                    return (
                      <View key={indexPlayerItem}>
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
                    );
                  })}
              </View>
            </View>
          </View>
          <View>
            <Text>{direTeamName}</Text>

            <View style={{ flexDirection: "row" }}>
              {item.players
                ?.slice(5, 10)
                .map((player: PlayerTeamFight, indexPlayer: number) => {
                  const heroName = heroNames[indexPlayer + 5];

                  let imgSource =
                    PICTURE_HERO_BASE_URL +
                    "/apps/dota2/images/dota_react/heroes/" +
                    heroName +
                    ".png?";

                  return (
                    <View key={indexPlayer}>
                      <Image
                        source={{ uri: imgSource }}
                        style={{
                          width: widthImage,
                          height: widthImage,
                          borderRadius: 3,
                          marginHorizontal: 1,
                        }}
                      />
                    </View>
                  );
                })}
            </View>
            <View
              style={{ width: "100%", paddingTop: "7%", paddingBottom: "7%" }}
            >
              <BarCarComponent
                formattedData={formattedDataDamageDire}
                color={RED}
              />
            </View>
            <View
              style={{ width: "100%", paddingTop: "7%", paddingBottom: "7%" }}
            >
              <BarCarComponent
                formattedData={formattedDataXpDire}
                color={GREEN}
              />
            </View>
            <View
              style={{ width: "100%", paddingTop: "7%", paddingBottom: "7%" }}
            >
              <BarCarComponent
                formattedData={formttedDataGoldDire}
                color={GOLD}
              />
            </View>
            {/* <View style={{ width: "100%", paddingTop: "7%" }}>
              <BarCarComponent
                formattedData={formattedHealingDire}
                color={BLUE}
              />
            </View> */}
            <Text style={styles.textLabel}>
              {englishLanguage ? "Abilities" : "Habilidades"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {item.players
                ?.slice(5, 10)
                .map((player: PlayerTeamFight, indexPlayer: number) => {
                  const abilities = Object.entries(player.ability_uses);

                  if (abilities.length === 0)
                    return (
                      <View key={indexPlayer + 50} style={styles.itemImage} />
                    );

                  return (
                    <View key={indexPlayer}>
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
                  );
                })}
            </View>
            <Text style={styles.textLabel}>
              {englishLanguage ? "Items" : "Itens"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {item.players
                ?.slice(5, 10)
                .map((player: PlayerTeamFight, indexPlayerItem: number) => {
                  const items = Object.entries(player.item_uses);

                  if (items.length === 0)
                    return (
                      <View
                        key={indexPlayerItem + 331}
                        style={styles.itemImage}
                      />
                    );

                  return (
                    <View key={indexPlayerItem}>
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
                  );
                })}
            </View>
          </View>
        </View>
      </View>
      /*
      <View style={[styles.renderItemContainer]}>
        <Text style={styles.textTime}>
          {englishLanguage ? "Time: " : "Hora: "}
          {formattedTime} - {endTime}
        </Text>

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
                borderTopWidth: indexPlayer > 0 ? 1 : 0,
                borderColor: "#ccc",
              }}
            >
              <Text
                style={[
                  styles.textTeam,
                  { display: indexPlayer === 0 ? "flex" : "none" },
                ]}
              >
                {radTeamName}
              </Text>
              <Text
                style={[
                  styles.textTeam,
                  { display: indexPlayer === 5 ? "flex" : "none" },
                ]}
              >
                {direTeamName}
              </Text>

              <View
                style={[
                  styles.headerContainer,
                  {
                    display:
                      indexPlayer === 0 || indexPlayer === 5 ? "flex" : "none",
                  },
                ]}
              >
                <View style={{ alignItems: "center", width: "18%" }}>
                  <MaterialCommunityIcons name="sword" size={iconSize} />
                </View>
                <View style={{ width: "32%", flexDirection: "row" }}>
                  <View style={{ width: "35%", alignItems: "center" }}>
                    <FontAwesome5
                      name="coins"
                      size={iconSize}
                      color={"#C99700"}
                    />
                  </View>
                  <View style={{ alignItems: "center", width: "35%" }}>
                    <MaterialCommunityIcons
                      name="arrow-up-bold-box"
                      size={iconSize}
                      color={"green"}
                    />
                  </View>
                  <View style={{ alignItems: "center", width: "30%" }}>
                    <FontAwesome5
                      name="plus-circle"
                      size={iconSize}
                      color={"green"}
                    />
                  </View>
                </View>
                <View style={{ width: "28%" }}>
                  <Text style={styles.textLabel}>Skills</Text>
                </View>
                <View style={{ width: "22%" }}>
                  <Text style={styles.textLabel}>
                    {englishLanguage ? "Items" : "Itens"}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "13%",
                  }}
                >
                  <View
                    style={{
                      width: widthImage,
                      aspectRatio: 1.5,
                      borderRadius: 3,
                      backgroundColor: "black",
                      position: "absolute",
                    }}
                  />
                  <Image
                    source={{ uri: imgSource }}
                    style={{
                      width: widthImage,
                      aspectRatio: 1.5,
                      borderRadius: 3,
                      opacity: player.deaths > 0 ? 0.5 : 1,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: player.deaths > 0 ? "flex" : "none",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: 3,
                        backgroundColor: "#981a33",
                        transform: [{ rotate: "30deg" }],
                      }}
                    />
                  </View>
                </View>
                <View style={{ width: "87%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "18%" }}>
                      <Text style={[styles.textData, { textAlign: "left" }]}>
                        {(item?.players ?? [])[
                          indexPlayer
                        ].damage.toLocaleString(
                          englishLanguage ? "en-us" : "pt-BR"
                        )}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            height: Dimensions.get("screen").width * 0.027,
                            backgroundColor: "#981a33",
                            width: `${
                              ((item?.players ?? [])[indexPlayer].damage /
                                maxDamage) *
                              100
                            }%`,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ width: "32%" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={[
                            styles.textData,
                            {
                              color: player.gold_delta < 0 ? "red" : "#333",
                              width: "35%",
                            },
                          ]}
                        >
                          {player.gold_delta.toLocaleString(
                            englishLanguage ? "en-US" : "pt-BR"
                          )}
                        </Text>
                        <Text style={[styles.textData, { width: "35%" }]}>
                          {player.xp_delta.toLocaleString(
                            englishLanguage ? "en-US" : "pt-BR"
                          )}
                        </Text>
                        <Text style={[styles.textData, { width: "30%" }]}>
                          {player.healing.toLocaleString(
                            englishLanguage ? "en-US" : "pt-BR"
                          )}
                        </Text>
                      </View>
                      <View style={styles.containerImage}>
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

                    <View style={[styles.containerImage, { width: "28%" }]}>
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
                    <View style={[styles.containerImage, { width: "22%" }]}>
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
            </View>
          );
        })}
      </View>*/
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
