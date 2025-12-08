import React, { useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import {
  HeroDetailsModel,
  KillDetails,
  MatchDetailsModel,
} from "@src/services/props";
import {
  PICTURE_HERO_BASE_FULL_URL,
  PICTURE_HERO_BASE_URL,
} from "@src/constants/player";
import { useTheme } from "@src/context/useThemeContext";
import { useSettingsContext } from "@src/context/useSettingsContext";
import { TextComponent } from "@src/components/TextComponent";

function HeroKillsDetails({
  matchDetails,
  direName,
  radName,
  heroArray,
}: {
  matchDetails: MatchDetailsModel;
  direName: string;
  radName: string;
  heroArray: HeroDetailsModel[];
}) {
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

  const validPlayers = matchDetails.players.filter(
    (player) => player.killed || player.killed_by
  );

  if (validPlayers.length === 0) return null;

  const killsDetails: KillDetails[] = useMemo(() => {
    return matchDetails.players.map((player) => {
      const heroIndex = heroArray.find((hero) => hero.id === player.hero_id);

      const heroName = heroIndex?.img ?? "";
      const playerName = player.name
        ? player.name
        : player.personaname
          ? player.personaname
          : englishLanguage
            ? "Private Profile"
            : "Perfil Privado";

      const kills = player.killed
        ? Object.entries(player.killed)
          .filter(([heroName]) => heroName.startsWith("npc_dota_hero"))
          .map(([heroName, count]) => ({
            heroName: heroName.replace("npc_dota_hero_", ""),
            count,
          }))
        : [];

      const killedBy = player.killed_by
        ? Object.entries(player.killed_by)
          .filter(([heroName]) => heroName.startsWith("npc_dota_hero"))
          .map(([heroName, count]) => ({
            heroName: heroName.replace("npc_dota_hero_", ""),
            count,
          }))
        : [];

      return { playerName, heroName, kills, killedBy };
    });
  }, [matchDetails, heroArray, englishLanguage]);

  //alert(JSON.stringify(killsDetails, null, 2));

  const renderItem = useCallback(
    ({ item, index }: { item: KillDetails; index: number }) => {
      const imgSource = PICTURE_HERO_BASE_URL + item.heroName;

      return (
        <View>
          <TextComponent
            weight="bold"
            style={[
              styles.textTeamName,
              {
                display: index == 0 ? "flex" : "none",
                color: ColorTheme.standard,
                borderTopWidth: index == 0 ? 1 : 0,
                borderColor: ColorTheme.standard,
              },
            ]}
          >
            {radName}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={[
              styles.textTeamName,
              {
                display: index == 5 ? "flex" : "none",
                borderTopWidth: index == 5 ? 1 : 0,
                borderColor: ColorTheme.standard,
                marginTop: index == 5 ? 7 : 0,
                color: ColorTheme.standard,
              },
            ]}
          >
            {direName}
          </TextComponent>
          <TextComponent weight="semibold" style={styles.textPlayerName}>{item.playerName}</TextComponent>
          <View style={styles.flatListRender}>
            <View
              style={{
                flexDirection: "row",
                width: "45%",
                justifyContent: "flex-end",
              }}
            >
              {item.kills.map((hero, index) => {
                const heroKill =
                  PICTURE_HERO_BASE_FULL_URL + hero.heroName + ".png";
                return (
                  <View key={index} style={{ flexDirection: "row" }}>
                    <View>
                      <TextComponent weight="semibold" style={styles.textKills}>{hero.count}x</TextComponent>
                      <View style={styles.imgContainer}>
                        <Image
                          style={styles.imgHero}
                          source={{ uri: heroKill }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={{ alignSelf: "center" }}>
              <Image
                style={{
                  width: Dimensions.get("screen").width * 0.1,
                  aspectRatio: 1,
                  borderRadius: 7,
                }}
                source={{
                  uri: imgSource,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", width: "45%" }}>
              {item.killedBy.map((hero, index) => {
                const heroKill =
                  PICTURE_HERO_BASE_FULL_URL + hero.heroName + ".png";
                return (
                  <View
                    key={index}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <View>
                      <TextComponent weight="semibold" style={styles.textKills}>{hero.count}x</TextComponent>
                      <View
                        style={[
                          styles.imgContainer,
                          { backgroundColor: "#000", borderColor: "red" },
                        ]}
                      >
                        <Image
                          style={[styles.imgHero, { opacity: 0.7 }]}
                          source={{ uri: heroKill }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      );
    },
    []
  );

  return (
    <View style={styles.container}>
      <TextComponent
        weight="bold"
        style={[
          styles.textTeamName,
          { fontSize: 19, color: ColorTheme.semidark },
        ]}
      >
        {englishLanguage ? "Kills Details" : "Detalhes de Mortes"}
      </TextComponent>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TextComponent weight="bold" style={[styles.textTeamName, { color: ColorTheme.semilight }]}>
          {englishLanguage ? "Kills" : "Mortes"}
        </TextComponent>
        <TextComponent weight="bold" style={[styles.textTeamName, { color: ColorTheme.semilight }]}>
          {englishLanguage ? "Deaths By" : "Morto por"}
        </TextComponent>
      </View>
      <FlatList
        data={killsDetails}
        renderItem={renderItem}
        keyExtractor={(item) => item.heroName.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

export const HeroKillsDetailsComponent = React.memo(HeroKillsDetails);
HeroKillsDetailsComponent.displayName = "HeroKillsDetailsComponent";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "5%",
  },
  textPlayerName: {
    textAlign: "center",
    fontSize: 10,
    color: "#888",
  },
  textTeamName: {
    textAlign: "center",
  },
  flatListRender: {
    flexDirection: "row",
    alignItems: "center",
  },
  textKills: {
    color: "#555",
    fontSize: 10,
    textAlign: "center",
  },
  imgHero: {
    width: Dimensions.get("screen").width * 0.053,
    aspectRatio: 1,
    borderRadius: 30,
  },
  imgContainer: {
    borderWidth: 1.75,
    borderColor: "#229f22",
    borderRadius: 30,
    marginHorizontal: 1,
  },
});
