import React, { useCallback, useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  FlatList,
  Image,
} from "react-native";
import { HeaderComponent } from "./Header";
import { TeamsComponent } from "./Teams";
import { BannerAds } from "../../../../src/components/Admob/BannerAds";
import { GraficsGoldAndXpComponent } from "./GraficsGoldAndXpTeam";
import {
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
} from "../../../../src/services/props";
import { createStyles } from "./styles";
import { useTheme } from "../../../../src/context/useThemeContext";
import { PICTURE_HERO_BASE_URL } from "../../../../src/constants/player";
import { useSettingsContext } from "../../../../src/context/useSettingsContext";

type Props = {
  refreshing: boolean;
  onRefresh: () => void;
  matchDetails: MatchDetailsModel | null;
  LobbyType: string | undefined;
  GameMode: string | undefined;
  PlayerIdIndex: string | null;
  radName: string;
  direName: string;
  heroArray: HeroDetailsModel[];
};

function OverViewComponent({
  refreshing,
  onRefresh,
  matchDetails,
  LobbyType,
  GameMode,
  PlayerIdIndex,
  radName,
  direName,
  heroArray,
}: Props) {
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const { englishLanguage } = useSettingsContext();

  const renderItemBans = useCallback(
    ({ item }: { item: MatchDetailsModel }) => {
      const heroBans = item.picks_bans?.filter((h) => !h.is_pick) || [];
      if (heroBans.length === 0) return null;

      return (
        <View style={{ marginTop: "1%", marginBottom: "3%" }}>
          <Text style={styles.title}>
            {englishLanguage ? "Heroes Banned" : "Heróis Banidos"}
          </Text>
          <View
            style={{
              justifyContent: "center",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {heroBans.map((ban, index) => {
              const hero = heroArray.find((h) => h.id === ban.hero_id);
              let imgSource = PICTURE_HERO_BASE_URL + hero?.img;
              return (
                <View
                  key={index}
                  style={{
                    borderRadius: 5,
                    margin: 1,
                    backgroundColor: "#000",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    style={[
                      styles.imageHeroItems,
                      { width: 30, height: 30, opacity: 0.7 },
                    ]}
                    source={{
                      uri: imgSource,
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
                    }}
                  >
                    <View
                      style={{
                        width: "130%",
                        height: 3,
                        backgroundColor: "#981a33",
                        transform: [{ rotate: "30deg" }],
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    },
    []
  );

  const stats = useMemo(() => {
    let heroDamageRad = 0;
    let heroDamageDire = 0;
    let healingRad = 0;
    let healingDire = 0;
    let netWorthRad = 0;
    let netWorthDire = 0;
    let towerDamageRad = 0;
    let towerDamageDire = 0;
    let xpRad = 0;
    let xpDire = 0;

    matchDetails?.players.slice(0, 5).forEach((p: Player) => {
      heroDamageRad += p.hero_damage;
      healingRad += p.hero_healing;
      netWorthRad += p.net_worth;
      towerDamageRad += p.tower_damage;
      xpRad += p.total_xp;
    });

    matchDetails?.players.slice(5, 10).forEach((p: Player) => {
      heroDamageDire += p.hero_damage;
      healingDire += p.hero_healing;
      netWorthDire += p.net_worth;
      towerDamageDire += p.tower_damage;
      xpDire += p.total_xp;
    });
    const heroDamRadBar =
      (heroDamageRad / Math.max(heroDamageRad, heroDamageDire)) * 100;
    const heroDamDireBar =
      (heroDamageDire / Math.max(heroDamageRad, heroDamageDire)) * 100;

    const towerDamRadBar =
      (towerDamageRad / Math.max(towerDamageRad, towerDamageDire)) * 100;
    const towerDamDireBar =
      (towerDamageDire / Math.max(towerDamageRad, towerDamageDire)) * 100;

    const healingRadBar =
      (healingRad / Math.max(healingRad, healingDire)) * 100;
    const healingDireBar =
      (healingDire / Math.max(healingRad, healingDire)) * 100;

    const netWorthRadBar =
      (netWorthRad / Math.max(netWorthRad, netWorthDire)) * 100;
    const netWorthDireBar =
      (netWorthDire / Math.max(netWorthRad, netWorthDire)) * 100;

    const xpRadBar = (xpRad / Math.max(xpRad, xpDire)) * 100;
    const xpDireBar = (xpDire / Math.max(xpRad, xpDire)) * 100;

    const towerRad = matchDetails?.tower_status_radiant.toString(2) || "0";
    const towerDire = matchDetails?.tower_status_dire.toString(2) || "0";

    const resultTowerRadBar = 11 - (towerRad?.split("1").length - 1);
    const resultTowerDireBar = 11 - (towerDire?.split("1").length - 1);

    return {
      towerDamageRad,
      towerDamageDire,
      netWorthRad,
      healingDire,
      netWorthDire,
      xpRad,
      xpDire,
      heroDamageRad,
      heroDamageDire,
      healingRad,
      heroDamRadBar,
      heroDamDireBar,
      towerDamRadBar,
      towerDamDireBar,
      healingRadBar,
      healingDireBar,
      netWorthRadBar,
      netWorthDireBar,
      xpRadBar,
      xpDireBar,
      towerRad,
      towerDire,
      resultTowerRadBar,
      resultTowerDireBar,
    };
  }, [matchDetails?.players]);

  const {
    netWorthRad,
    netWorthDire,
    towerDamageRad,
    towerDamageDire,
    xpRad,
    xpDire,
    heroDamageRad,
    healingDire,
    heroDamageDire,
    healingRad,
    heroDamRadBar,
    heroDamDireBar,
    towerDamRadBar,
    towerDamDireBar,
    healingRadBar,
    healingDireBar,
    netWorthRadBar,
    netWorthDireBar,
    xpRadBar,
    xpDireBar,
    resultTowerRadBar,
    resultTowerDireBar,
  } = stats;

  return (
    <View style={{ flex: 1, backgroundColor: ColorTheme.light }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeaderComponent
          matchDetails={matchDetails}
          lobbyType={LobbyType}
          gameMode={GameMode}
        />
        <TeamsComponent
          matchDetails={matchDetails}
          PlayerIdIndex={PlayerIdIndex}
        />
        {matchDetails &&
        matchDetails.picks_bans &&
        matchDetails.picks_bans.map((p) => p.is_pick) ? (
          <View style={styles.containerItem}>
            <FlatList
              data={matchDetails ? [matchDetails] : []}
              renderItem={renderItemBans}
              keyExtractor={(item) => item.match_id.toString()}
              scrollEnabled={false}
            />
          </View>
        ) : null}
        <View
          style={[
            styles.containerItem,
            {
              padding: "1%",
              paddingBottom: "3%",
              paddingTop: "3%",
            },
          ]}
        >
          <Text style={styles.title}>Performance</Text>
          <View style={styles.detailsContainer}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.detailsContent}>
                <View style={{ width: "100%" }}>
                  <Text style={styles.textTitle}>Hero Damage</Text>
                  <View style={{ flexDirection: "row", width: "70%" }}>
                    <Text
                      style={[
                        styles.barRadiant,
                        { width: `${heroDamRadBar}%` },
                      ]}
                    />
                    <Text style={styles.textResult}>
                      {" "}
                      {heroDamageRad.toLocaleString(
                        englishLanguage ? "en-US" : "pt-BR"
                      )}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barDire, { width: `${heroDamDireBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {heroDamageDire.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>
                <Text style={styles.textTitle}>Tower Damage</Text>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barRadiant, { width: `${towerDamRadBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {towerDamageRad.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barDire, { width: `${towerDamDireBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {towerDamageDire.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>

                <Text style={styles.textTitle}>Networth</Text>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barRadiant, { width: `${netWorthRadBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {netWorthRad.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barDire, { width: `${netWorthDireBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {netWorthDire.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsContent}>
                <Text style={styles.textTitle}>Healing</Text>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barRadiant, { width: `${healingRadBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {healingRad.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barDire, { width: `${healingDireBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {healingDire.toLocaleString(
                      englishLanguage ? "en-US" : "pt-BR"
                    )}
                  </Text>
                </View>
                <Text style={styles.textTitle}>
                  {englishLanguage ? "Towers Destroied" : "Torres Destruídas"}
                </Text>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[
                      styles.barRadiant,
                      { width: `${(resultTowerDireBar / 11) * 100}%` },
                    ]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {resultTowerDireBar}/11
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[
                      styles.barDire,
                      { width: `${(resultTowerRadBar / 11) * 100}%` },
                    ]}
                  />
                  <Text style={styles.textResult}> {resultTowerRadBar}/11</Text>
                </View>

                <Text style={styles.textTitle}>Xp</Text>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text
                    style={[styles.barRadiant, { width: `${xpRadBar}%` }]}
                  />
                  <Text style={styles.textResult}>
                    {" "}
                    {xpRad.toLocaleString(englishLanguage ? "en-US" : "pt-BR")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "70%" }}>
                  <Text style={[styles.barDire, { width: `${xpDireBar}%` }]} />
                  <Text style={styles.textResult}>
                    {" "}
                    {xpDire.toLocaleString(englishLanguage ? "en-US" : "pt-BR")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {matchDetails &&
          matchDetails.radiant_gold_adv &&
          matchDetails.radiant_gold_adv.length > 0 &&
          matchDetails.radiant_xp_adv &&
          matchDetails.radiant_xp_adv.length > 0 && (
            <View
              style={[
                styles.containerItem,
                {
                  padding: "1%",
                  paddingBottom: "7%",
                  paddingTop: "3%",
                },
              ]}
            >
              <GraficsGoldAndXpComponent
                radiant_gold_adv={matchDetails.radiant_gold_adv}
                radiant_xp_adv={matchDetails.radiant_xp_adv}
                RadiantName={matchDetails?.radiant_team?.name ?? radName}
                DireName={matchDetails?.dire_team?.name ?? direName}
              />
            </View>
          )}
      </ScrollView>
      <BannerAds />
    </View>
  );
}

export const OverViewTabs = React.memo(OverViewComponent);
OverViewTabs.displayName = "OverViewTabs";
