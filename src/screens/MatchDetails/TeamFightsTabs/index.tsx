import React, { useMemo } from "react";
import { View, FlatList } from "react-native";

import { createStyles } from "./styles";
import { TeamFightModel } from "@src/services/props";
import { useSettingsContext } from "@src/context/useSettingsContext";

import { useTheme } from "@src/context/useThemeContext";
import { BarChartComponent } from "./BarCharComponent";
import { TeamSide } from "@src/services/enum";
import { RenderHeroIcon } from "./components/heroIcon";
import { KillsImage } from "./components/killsImage";
import { AbilitiesUsages } from "./components/abilities";
import { ItemsUsages } from "./components/items";
import { processTeamFights } from "@src/utils/ProcessedTemFight";
import { useTeamFightsStore } from "@src/store/teamFights";
import { TextComponent } from "@src/components/TextComponent";

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
const formatTime = (seconds?: number) => {
  if (!seconds) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

function TeamFightsComponent() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const { teamFights, heroNames, radTeamName, direTeamName, update } =
    useTeamFightsStore((state) => state.data!);

  const styles = createStyles(ColorTheme);

  const processedFights = useMemo(() => {
    return teamFights ? processTeamFights(teamFights, formatTime) : null;
  }, []);

  const TeamFightItem = React.memo(({ fight }: { fight: ProcessedFight }) => {
    return (
      <View style={[styles.renderItemContainer]}>
        <TextComponent style={styles.textTime}>
          {englishLanguage ? "Time: " : "Hora: "}
          {fight.formattedTime} - {fight.endTime}
        </TextComponent>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "40%" }}>
            <TextComponent
              weight="bold"
              style={styles.textTitle}
              numberOfLines={1}
            >
              {radTeamName}
            </TextComponent>
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
            <View style={styles.barChartLabel}>
              <TextComponent
                weight="bold"
                style={[styles.textLabel, { borderBottomWidth: 0 }]}
              >
                {englishLanguage ? "Damage Caused" : "Dano Causado"}
              </TextComponent>
            </View>
            <View style={styles.barChartLabel}>
              <TextComponent
                weight="bold"
                style={[styles.textLabel, { borderBottomWidth: 0 }]}
              >
                Xp
              </TextComponent>
            </View>
            <View style={styles.barChartLabel}>
              <TextComponent
                weight="bold"
                style={[styles.textLabel, { borderBottomWidth: 0 }]}
              >
                {englishLanguage ? "Gold" : "Ouro"}
              </TextComponent>
            </View>
          </View>
          <View style={{ width: "40%" }}>
            <TextComponent
              weight="bold"
              style={styles.textTitle}
              numberOfLines={1}
            >
              {direTeamName}
            </TextComponent>

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

  //if (teamFights?.length == 0) return <ErrorComponent action={update} />;

  return (
    <View style={[styles.container]}>
      <FlatList
        data={processedFights}
        renderItem={({ item }) => <TeamFightItem fight={item} />}
        keyExtractor={(item) => item.start.toString()}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
}

export const TeamFightsTabs = React.memo(TeamFightsComponent);
TeamFightsTabs.displayName = "TeamFightsTabs";
