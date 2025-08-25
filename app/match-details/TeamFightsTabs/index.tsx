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

import { createStyles } from "./styles";
import { PlayerTeamFight, TeamFightModel } from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_FULL_URL,
  PICTURE_HERO_BASE_URL,
} from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";
import { BarChartComponent } from "./BarCharComponent";
import { BannerAds } from "../../../src/components/Admob/BannerAds";
import EmptyImage from "../../../src/images/emptyImage.png";

const GREEN = "#71BD6A";
const RED = "#D14B5A";
const GOLD = "#DAA520";
const BLUE = "#219FD5";

const barChartHeight = Dimensions.get("window").height * 0.15;

type ProcessedFight = TeamFightModel & {
  formattedTime: string;
  endTime: string;
  damageRad: { y: number }[];
  damageDire: { y: number }[];
  goldRad: { y: number }[];
  goldDire: { y: number }[];
  xpRad: { y: number }[];
  xpDire: { y: number }[];
  healingRad: { y: number }[];
  healingDire: { y: number }[];
  emptyRadKilledList?: boolean;
  emptyDireKilledList?: boolean;
};

function TeamFightsComponent({
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

  const formatTime = (seconds?: number) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const processedFights = useMemo<ProcessedFight[] | undefined>(() => {
    return teamFights?.map((fight) => {
      const damageArray = fight.players?.map((p) => p.damage) || [];
      const goldArray = fight.players?.map((p) => p.gold_delta) || [];
      const xpArray = fight.players?.map((p) => p.xp_delta) || [];
      const healingArray = fight.players?.map((p) => p.healing) || [];

      return {
        ...fight,
        formattedTime: formatTime(fight.start),
        endTime: formatTime(fight.end),
        damageRad: damageArray.slice(0, 5).map((value) => ({ y: value })),
        damageDire: damageArray.slice(5, 10).map((value) => ({ y: value })),
        goldRad: goldArray.slice(0, 5).map((value) => ({ y: value })),
        goldDire: goldArray.slice(5, 10).map((value) => ({ y: value })),
        xpRad: xpArray.slice(0, 5).map((value) => ({ y: value })),
        xpDire: xpArray.slice(5, 10).map((value) => ({ y: value })),
        healingRad: healingArray.slice(0, 5).map((value) => ({ y: value })),
        healingDire: healingArray.slice(5, 10).map((value) => ({ y: value })),
        emptyRadKilledList: fight.players
          ?.slice(0, 5)
          .every((p) => Object.keys(p.killed).length === 0),
        emptyDireKilledList: fight.players
          ?.slice(5, 10)
          .every((p) => Object.keys(p.killed).length === 0),
      };
    });
  }, [teamFights]);

  const TeamFightItem = React.memo(({ fight }: { fight: ProcessedFight }) => {
    return (
      <View style={[styles.renderItemContainer]}>
        <Text style={styles.textTime}>
          {englishLanguage ? "Time: " : "Hora: "}
          {fight.formattedTime} - {fight.endTime}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "40%" }}>
            <Text style={styles.textTitle} numberOfLines={1}>
              {radTeamName}
            </Text>
            <View>
              <View style={{ flexDirection: "row" }}>
                {fight.players
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
                              player.deaths > 0 ? "red" : "transparent",
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
                              backgroundColor: "#000",
                              transform: [{ rotate: "45deg" }],
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
              </View>
              <View
                style={{
                  width: "100%",
                  height: barChartHeight,
                  paddingTop: "7%",
                  paddingBottom: "7%",
                }}
              >
                <BarChartComponent
                  formattedData={fight.damageRad}
                  color={RED}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  height: barChartHeight,
                  paddingTop: "7%",
                  paddingBottom: "7%",
                }}
              >
                <BarChartComponent formattedData={fight.xpRad} color={GREEN} />
              </View>
              <View
                style={{
                  width: "100%",
                  height: barChartHeight,
                  paddingTop: "7%",
                  paddingBottom: "7%",
                }}
              >
                <BarChartComponent formattedData={fight.goldRad} color={GOLD} />
              </View>
              {/* <View style={{ width: "100%", paddingTop: "7%" }}>
                <BarCarComponent
                  formattedData={formattedHealingRad}
                  color={BLUE}
                />
              </View> */}
              {!fight.emptyRadKilledList && (
                <View>
                  <Text style={styles.textLabel}>
                    {englishLanguage ? "Kills" : "Abates"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    {fight.players
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
                                  PICTURE_HERO_BASE_FULL_URL +
                                  heroName +
                                  ".png";

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
                </View>
              )}

              <Text style={styles.textLabel}>
                {englishLanguage ? "Abilities" : "Habilidades"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {fight.players
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
                {fight.players
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
                height: barChartHeight,
                backgroundColor: "puple",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={[styles.textLabel, { borderBottomWidth: 0 }]}>
                {englishLanguage ? "Damage Caused" : "Dano Causado"}
              </Text>
            </View>
            <View
              style={{
                height: barChartHeight,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={[styles.textLabel, { borderBottomWidth: 0 }]}>
                Xp
              </Text>
            </View>
            <View
              style={{
                height: barChartHeight,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={[styles.textLabel, { borderBottomWidth: 0 }]}>
                {englishLanguage ? "Gold" : "Ouro"}
              </Text>
            </View>
          </View>
          <View style={{ width: "40%" }}>
            <Text style={styles.textTitle} numberOfLines={1}>
              {direTeamName}
            </Text>

            <View style={{ flexDirection: "row" }}>
              {fight.players
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
                            player.deaths > 0 ? "red" : "transparent",
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
                            backgroundColor: "#000",
                            transform: [{ rotate: "45deg" }],
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
            <View
              style={{
                width: "100%",
                height: barChartHeight,
                paddingTop: "7%",
                paddingBottom: "7%",
              }}
            >
              <BarChartComponent formattedData={fight.damageDire} color={RED} />
            </View>
            <View
              style={{
                width: "100%",
                height: barChartHeight,
                paddingTop: "7%",
                paddingBottom: "7%",
              }}
            >
              <BarChartComponent formattedData={fight.xpDire} color={GREEN} />
            </View>
            <View
              style={{
                width: "100%",
                height: barChartHeight,
                paddingTop: "7%",
                paddingBottom: "7%",
              }}
            >
              <BarChartComponent formattedData={fight.goldDire} color={GOLD} />
            </View>
            {!fight.emptyDireKilledList && (
              <View>
                <Text style={styles.textLabel}>
                  {englishLanguage ? "Kills" : "Abates"}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {fight.players
                    ?.slice(5, 10)
                    .map((player: PlayerTeamFight, indexPlayer: number) => {
                      const heroesKilled = Object.entries(player.killed);
                      if (heroesKilled.length === 0)
                        return (
                          <View key={indexPlayer} style={styles.itemImage} />
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
                  {fight.players
                    ?.slice(5, 10)
                    .map((player: PlayerTeamFight, indexPlayer: number) => {
                      const abilities = Object.entries(player.ability_uses);

                      if (abilities.length === 0)
                        return (
                          <View
                            key={indexPlayer + 50}
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
              </View>
            )}
            <Text style={styles.textLabel}>
              {englishLanguage ? "Items" : "Itens"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {fight.players
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
  });

  return (
    <View style={[styles.container, { backgroundColor: ColorTheme.light }]}>
      <FlatList
        data={processedFights}
        renderItem={({ item }) => <TeamFightItem fight={item} />}
        keyExtractor={(item) => item.start.toString()}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={2}
        removeClippedSubviews
      />
      <BannerAds />
    </View>
  );
}

export const TeamFightsTabs = React.memo(TeamFightsComponent);
TeamFightsTabs.displayName = "TeamFightsTabs";
