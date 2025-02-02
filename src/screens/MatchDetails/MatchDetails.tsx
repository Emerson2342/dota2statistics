import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { createStyles } from "./MatchDetailsStyles";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import {
  HeroDetailsModel,
  MatchDetailsModel,
  MatchDetailsProps,
  Player,
} from "../../services/props";
import {
  MATCHE_DETAILS_API_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "../../constants/player";
import { BannerAds } from "../../components/BannerAds";
import { MotiView } from "moti";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useMatchesDetailsListContext } from "../../context/useMatchesDetailsListContext";
import { useTheme } from "../../context/useThemeContext";
import { GraficsGoldAndXp } from "./Grafic";
import { Abilities } from "./Abilities";
import { Items } from "./Items";
import { Header } from "./Header";
import { Teams } from "./Teams";
import { useNavigation } from "@react-navigation/native";

export const MatchDetails = ({ route }: MatchDetailsProps) => {
  const {
    MatchDetailsIndex,
    PlayerIdIndex,
    RadiantName,
    DireName,
    LeagueNameIndex,
  } = route.params;

  const navigation = useNavigation();
  const { englishLanguage } = useSettingsContext();
  const { matchesDetailsList, setMatchesDetailsList } =
    useMatchesDetailsListContext();
  const { ColorTheme } = useTheme();

  const [matchDetails, setMatchDetails] = useState<MatchDetailsModel | null>(
    null
  );
  //const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const styles = createStyles(ColorTheme);
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  useEffect(() => {
    console.log("Renderizou");
    const fetchMatchDetails = async () => {
      const match =
        MatchDetailsIndex &&
        matchesDetailsList.find(
          (m: MatchDetailsModel) => m.match_id === MatchDetailsIndex
        );
      if (match) {
        console.log("Partida Encontrada");
        setTimeout(() => {
          setMatchDetails(match);
          setIsLoading(false);
        }, 200);
      } else {
        await handleSearchMatche();
      }
    };

    fetchMatchDetails();
  }, [route.params]);

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

  const healingRadBar = (healingRad / Math.max(healingRad, healingDire)) * 100;
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

  const fetchGetMatchDetailsData = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = (await response.json()) as MatchDetailsModel;
      const matchDataResponse: MatchDetailsModel = {
        players: data.players.map(
          (player: any): Player => ({
            account_id: player.account_id,
            win: player.win,
            lose: player.lose,
            duration: player.duration,
            personaname: player.personaname,
            name: player.name,
            hero_id: player.hero_id,
            item_0: player.item_0,
            item_1: player.item_1,
            item_2: player.item_2,
            item_3: player.item_3,
            item_4: player.item_4,
            item_5: player.item_5,
            backpack_0: player.backpack_0,
            backpack_1: player.backpack_1,
            backpack_2: player.backpack_2,
            item_neutral: player.item_neutral,
            start_time: player.start_time,
            kills: player.kills,
            deaths: player.deaths,
            assists: player.assists,
            last_hits: player.last_hits,
            denies: player.denies,
            gold_per_min: player.gold_per_min,
            total_xp: player.total_xp,
            xp_per_min: player.xp_per_min,
            level: player.level,
            net_worth: player.net_worth,
            aghanims_scepter: player.aghanims_scepter,
            aghanims_shard: player.aghanims_shard,
            hero_damage: player.hero_damage,
            tower_damage: player.tower_damage,
            hero_healing: player.hero_healing,
            isRadiant: player.isRadiant,
            rank_tier: player.rank_tier,
            benchmarks: {
              gold_per_min: player.benchmarks?.gold_per_min,
              xp_per_min: player.benchmarks?.xp_per_min,
              kills_per_min: player.benchmarks?.kills_per_min,
              last_hits_per_min: player.benchmarks?.last_hits_per_min,
              hero_damage_per_min: player.benchmarks?.hero_damage_per_min,
              hero_healing_per_min: player.benchmarks?.hero_healing_per_min,
              tower_damage: player.benchmarks?.tower_damage,
            },
            ability_upgrades_arr: player.ability_upgrades_arr,
          })
        ),
        radiant_win: data.radiant_win,
        duration: data.duration,
        start_time: data.start_time,
        match_id: data.match_id,
        tower_status_radiant: data.tower_status_radiant,
        tower_status_dire: data.tower_status_dire,
        barracks_status_radiant: data.barracks_status_radiant,
        barracks_status_dire: data.barracks_status_dire,
        game_mode: data.game_mode,
        radiant_score: data.radiant_score,
        dire_score: data.dire_score,
        picks_bans: data.picks_bans,
        radiant_gold_adv: data.radiant_gold_adv,
        radiant_xp_adv: data.radiant_xp_adv,
      };

      setMatchDetails(matchDataResponse);
      let updatedMatchesList = [...matchesDetailsList, matchDataResponse];
      if (updatedMatchesList.length > 20) {
        updatedMatchesList = updatedMatchesList.slice(1);
      }
      setMatchesDetailsList(updatedMatchesList);
    } catch (error) {
      console.error("Erro buscar partida: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleSearchMatche() {
    if (!MatchDetailsIndex) return;
    try {
      const recentMatchesUrl = `${MATCHE_DETAILS_API_BASE_URL}${MatchDetailsIndex}`;
      await fetchGetMatchDetailsData(recentMatchesUrl);
      console.log("Partida buscada no servidor");
    } catch (error) {
      console.log("Erro ao buscar detalhes da partida:", error);
    }
  }

  const renderItemBans = ({ item }: { item: MatchDetailsModel }) => {
    const heroBans = item.picks_bans?.filter((h) => !h.is_pick) || [];

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
  };

  return (
    <View style={styles.container}>
      {!isLoading && matchDetails ? (
        <View style={{ flex: 1 }}>
          <Header
            LeagueNameIndex={LeagueNameIndex}
            RadiantName={RadiantName}
            DireName={DireName}
            matchDetails={matchDetails}
          />
          <ScrollView style={{ marginTop: "2%" }}>
            <View style={{ alignItems: "center" }}>
              <Teams
                matchDetails={matchDetails}
                RadiantName={RadiantName}
                DireName={DireName}
                PlayerIdIndex={PlayerIdIndex}
              />

              {matchDetails.picks_bans && matchDetails.picks_bans.length > 0 ? (
                <View style={styles.containerItem}>
                  <FlatList
                    data={matchDetails ? [matchDetails] : []}
                    renderItem={renderItemBans}
                    keyExtractor={(item) => item.match_id.toString()}
                    scrollEnabled={false}
                  />
                </View>
              ) : (
                <></>
              )}
              <View style={styles.containerItem}>
                <Items
                  playerIndex={PlayerIdIndex}
                  matchDetails={matchDetails}
                  RadName={RadiantName}
                  DireName={DireName}
                />
              </View>

              <View style={styles.containerItem}>
                <Abilities
                  RadName={RadiantName}
                  DireName={DireName}
                  matchDetails={matchDetails}
                />
              </View>

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
                          style={[
                            styles.barDire,
                            { width: `${heroDamDireBar}%` },
                          ]}
                        />
                        <Text style={styles.textResult}> {heroDamageDire}</Text>
                      </View>
                      <Text style={styles.textTitle}>Tower Damage</Text>
                      <View style={{ flexDirection: "row", width: "70%" }}>
                        <Text
                          style={[
                            styles.barRadiant,
                            { width: `${towerDamRadBar}%` },
                          ]}
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
                          style={[
                            styles.barDire,
                            { width: `${towerDamDireBar}%` },
                          ]}
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
                          style={[
                            styles.barRadiant,
                            { width: `${netWorthRadBar}%` },
                          ]}
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
                          style={[
                            styles.barDire,
                            { width: `${netWorthDireBar}%` },
                          ]}
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
                          style={[
                            styles.barRadiant,
                            { width: `${healingRadBar}%` },
                          ]}
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
                          style={[
                            styles.barDire,
                            { width: `${healingDireBar}%` },
                          ]}
                        />
                        <Text style={styles.textResult}>
                          {" "}
                          {healingDire.toLocaleString(
                            englishLanguage ? "en-US" : "pt-BR"
                          )}
                        </Text>
                      </View>
                      <Text style={styles.textTitle}>
                        {englishLanguage
                          ? "Towers Destroied"
                          : "Torres Destruídas"}
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
                        <Text style={styles.textResult}>
                          {" "}
                          {resultTowerRadBar}/11
                        </Text>
                      </View>

                      <Text style={styles.textTitle}>Xp</Text>
                      <View style={{ flexDirection: "row", width: "70%" }}>
                        <Text
                          style={[styles.barRadiant, { width: `${xpRadBar}%` }]}
                        />
                        <Text style={styles.textResult}>
                          {" "}
                          {xpRad.toLocaleString(
                            englishLanguage ? "en-US" : "pt-BR"
                          )}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", width: "70%" }}>
                        <Text
                          style={[styles.barDire, { width: `${xpDireBar}%` }]}
                        />
                        <Text style={styles.textResult}>
                          {" "}
                          {xpDire.toLocaleString(
                            englishLanguage ? "en-US" : "pt-BR"
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {matchDetails.radiant_gold_adv && matchDetails.radiant_xp_adv && (
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
                  <GraficsGoldAndXp
                    radiant_gold_adv={matchDetails.radiant_gold_adv}
                    radiant_xp_adv={matchDetails.radiant_xp_adv}
                    RadiantName={RadiantName}
                    DireName={DireName}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          <BannerAds />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              flex: 0.9,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={ColorTheme.standard} />
            <Text style={{ fontFamily: "QuickSand-Semibold" }}>
              {englishLanguage ? "Loading match..." : "Carregando partida..."}
            </Text>
          </View>
          <BannerAds />
        </View>
      )}
    </View>
  );
};
