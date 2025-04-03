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
import { PlayerTeamFight, TeamFightModel } from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_FULL_URL,
  PICTURE_HERO_BASE_URL,
} from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";
import { BarCarComponent } from "./BarCharComponent";
import { BannerAds } from "../../../src/components/BannerAds";
import EmptyImage from "../../images/icon.png";

const GREEN = processColor("#71BD6A");
const RED = processColor("#D14B5A");
const GOLD = processColor("#DAA520");
const BLUE = processColor("#219FD5");

export function TeamFightsTab({
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
  const widthImage = Dimensions.get("window").height * 0.0339;

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

    const formttedDataGoldDire = goldArray
      .slice(5, 10)
      .map((value) => ({ y: value }));

    const formattedDataXpRad = xpArray
      .slice(0, 5)
      .map((value) => ({ y: value }));
    const formattedDataXpDire = xpArray
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
          <View style={{ width: "40%" }}>
            <Text style={styles.textTitle}>{radTeamName}</Text>
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
                      <View
                        style={[
                          styles.itemImage,
                          {
                            backgroundColor:
                              player.deaths > 0 ? "black" : "transparent",
                            overflow: "hidden",
                          },
                        ]}
                        key={indexPlayer}
                      >
                        <Image
                          source={{ uri: imgSource }}
                          style={[
                            styles.itemImage,
                            { opacity: player.deaths > 0 ? 0.45 : 1 },
                          ]}
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
                              width: "120%",
                              height: 1.5,
                              backgroundColor: "#981a33",
                              transform: [{ rotate: "45deg" }],
                            }}
                          />
                        </View>
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
                {englishLanguage ? "Kills" : "Abates"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {item.players
                  ?.slice(0, 5)
                  .map((player: PlayerTeamFight, indexPlayer: number) => {
                    const heroesKilled = Object.entries(player.killed);
                    if (heroesKilled.length === 0)
                      return (
                        <View
                          key={indexPlayer + 139}
                          style={styles.itemImage}
                        />
                      );

                    return (
                      <View key={indexPlayer}>
                        {Object.entries(player.killed).map(
                          (
                            [heroKilled, usageCount]: [string, number],
                            index: number
                          ) => {
                            const heroName = heroKilled.replace(
                              "npc_dota_hero_",
                              ""
                            );
                            const heroImg =
                              PICTURE_HERO_BASE_FULL_URL + heroName + ".png";

                            return (
                              <View
                                key={index}
                                style={{
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={{ uri: heroImg }}
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
                {englishLanguage ? "Abilities" : "Habilidades"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {item.players
                  ?.slice(0, 5)
                  .map((player: PlayerTeamFight, indexPlayer: number) => {
                    const abilities = Object.entries(player.ability_uses);

                    if (abilities.length === 0)
                      return (
                        <View
                          key={indexPlayer + 139}
                          style={styles.itemImage}
                        />
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
                                  source={EmptyImage}
                                  style={[
                                    styles.itemImage,
                                    { position: "absolute" },
                                  ]}
                                />
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
                                  source={EmptyImage}
                                  style={[
                                    styles.itemImage,
                                    { position: "absolute" },
                                  ]}
                                />
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
          <View style={{ width: "20%" }}>
            <Text style={styles.textTitle} />
            <View
              style={{
                height: Dimensions.get("window").width * 0.067,
              }}
            />
            <View
              style={{
                height: Dimensions.get("window").height * 0.063,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={styles.textLabel}>
                {englishLanguage ? "Damage Caused" : "Dano Causado"}
              </Text>
            </View>
            <View
              style={{
                height: Dimensions.get("window").height * 0.083,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={styles.textLabel}>Xp</Text>
            </View>
            <View
              style={{
                height: Dimensions.get("window").height * 0.075,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={styles.textLabel}>
                {englishLanguage ? "Gold" : "Ouro"}
              </Text>
            </View>
          </View>
          <View style={{ width: "40%" }}>
            <Text style={styles.textTitle}>{direTeamName}</Text>

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
                    <View
                      style={[
                        styles.itemImage,
                        {
                          backgroundColor:
                            player.deaths > 0 ? "black" : "transparent",
                          overflow: "hidden",
                        },
                      ]}
                      key={indexPlayer}
                    >
                      <Image
                        source={{ uri: imgSource }}
                        style={[
                          styles.itemImage,
                          { opacity: player.deaths > 0 ? 0.45 : 1 },
                        ]}
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
                            width: "120%",
                            height: 1.5,
                            backgroundColor: "#981a33",
                            transform: [{ rotate: "45deg" }],
                          }}
                        />
                      </View>
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
            <Text style={styles.textLabel}>
              {englishLanguage ? "Kills" : "Abates"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {item.players
                ?.slice(5, 10)
                .map((player: PlayerTeamFight, indexPlayer: number) => {
                  const heroesKilled = Object.entries(player.killed);
                  if (heroesKilled.length === 0)
                    return (
                      <View key={indexPlayer + 139} style={styles.itemImage} />
                    );

                  return (
                    <View key={indexPlayer}>
                      {Object.entries(player.killed).map(
                        (
                          [heroKilled, usageCount]: [string, number],
                          index: number
                        ) => {
                          const heroName = heroKilled.replace(
                            "npc_dota_hero_",
                            ""
                          );
                          const heroImg =
                            PICTURE_HERO_BASE_FULL_URL + heroName + ".png";

                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: heroImg }}
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
                                source={EmptyImage}
                                style={[
                                  styles.itemImage,
                                  { position: "absolute" },
                                ]}
                              />
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
                        key={indexPlayerItem + 503}
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
                                source={EmptyImage}
                                style={[
                                  styles.itemImage,
                                  { position: "absolute" },
                                ]}
                              />
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
      />
      <BannerAds />
    </View>
  );
}
