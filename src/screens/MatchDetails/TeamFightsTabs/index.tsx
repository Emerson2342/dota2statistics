import React, { useMemo } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";

import { createStyles } from "./styles";
import { TeamFightModel } from "../../../services/props";
import { useSettingsContext } from "../../../context/useSettingsContext";

import { useTheme } from "../../../context/useThemeContext";
import { BarChartComponent } from "./BarCharComponent";
import { BannerAds } from "../../../components/Admob/BannerAds";
import { TeamSide } from "../../../../src/services/enum";
import { RenderHeroIcon } from "./components/heroIcon";
import { KillsImage } from "./components/killsImage";
import { AbilitiesUsages } from "./components/abilities";
import { ItemsUsages } from "./components/items";

const GREEN = "#71BD6A";
const RED = "#D14B5A";
const GOLD = "#DAA520";

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
                <RenderHeroIcon
                  fight={fight}
                  team={TeamSide.Radiant}
                  heroNames={heroNames}
                  color={ColorTheme}
                />
              </View>
              <View style={styles.barChart}>
                <BarChartComponent
                  formattedData={fight.damageRad}
                  color={RED}
                />
              </View>
              <View style={styles.barChart}>
                <BarChartComponent formattedData={fight.xpRad} color={GREEN} />
              </View>
              <View style={styles.barChart}>
                <BarChartComponent formattedData={fight.goldRad} color={GOLD} />
              </View>
              <KillsImage
                color={ColorTheme}
                fight={fight}
                label={englishLanguage ? "Kills" : "Abates"}
                team={TeamSide.Radiant}
              />
              <AbilitiesUsages
                colors={ColorTheme}
                label={
                  englishLanguage ? "Abilities Used" : "Habilidades Utilizadas"
                }
                fight={fight}
                team={TeamSide.Radiant}
              />

              <ItemsUsages
                color={ColorTheme}
                label={englishLanguage ? "Items Used" : "Itens Utilizados"}
                fight={fight}
                team={TeamSide.Radiant}
              />
            </View>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.textTitle} />
            <View style={styles.barChartLabel}>
              <Text style={[styles.textLabel, { borderBottomWidth: 0 }]}>
                {englishLanguage ? "Damage Caused" : "Dano Causado"}
              </Text>
            </View>
            <View style={styles.barChartLabel}>
              <Text style={[styles.textLabel, { borderBottomWidth: 0 }]}>
                Xp
              </Text>
            </View>
            <View style={styles.barChartLabel}>
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
              <RenderHeroIcon
                fight={fight}
                team={TeamSide.Dire}
                heroNames={heroNames}
                color={ColorTheme}
              />
            </View>
            <View style={styles.barChart}>
              <BarChartComponent formattedData={fight.damageDire} color={RED} />
            </View>
            <View style={styles.barChart}>
              <BarChartComponent formattedData={fight.xpDire} color={GREEN} />
            </View>
            <View style={styles.barChart}>
              <BarChartComponent formattedData={fight.goldDire} color={GOLD} />
            </View>
            <KillsImage
              color={ColorTheme}
              fight={fight}
              label={englishLanguage ? "Kills" : "Abates"}
              team={TeamSide.Dire}
            />
            <AbilitiesUsages
              colors={ColorTheme}
              label={
                englishLanguage ? "Abilities Used" : "Habilidades Utilizadas"
              }
              fight={fight}
              team={TeamSide.Dire}
            />
            <ItemsUsages
              color={ColorTheme}
              label={englishLanguage ? "Items Used" : "Itens Utilizados"}
              fight={fight}
              team={TeamSide.Dire}
            />
          </View>
        </View>
      </View>
    );
  });

  return (
    <View style={[styles.container]}>
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
