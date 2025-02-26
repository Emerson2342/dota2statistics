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
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { GraficsGoldAndXp } from "./Grafic";
import { Abilities } from "./Abilities";
import { Items } from "./Items";
import { Header } from "./Header";
import { Teams } from "./Teams";
import { getMatchDetails } from "../../../src/API";
import { AsyncStorageService } from "../../../src/services/StorageService";
import { HeroKillsDetails } from "./KillsDetails";

export const MatchDetails = ({ route }: MatchDetailsProps) => {
  const {
    MatchDetailsIndex,
    PlayerIdIndex,
    RadiantName,
    DireName,
    LeagueNameIndex,
  } = route.params;

  const { englishLanguage } = useSettingsContext();
  const [matchesDetailsList, setMatchesDetailsList] = useState<
    MatchDetailsModel[]
  >([]);
  const [loadedeList, setLoadedList] = useState(false);

  const storage = new AsyncStorageService();

  const { ColorTheme } = useTheme();

  const [matchDetails, setMatchDetails] = useState<MatchDetailsModel | null>(
    null
  );
  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const styles = createStyles(ColorTheme);
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  useEffect(() => {
    const loadMatchesList = async () => {
      try {
        const storedMatchesList = await storage.getItem<MatchDetailsModel[]>(
          "matchesDetailsList1"
        );
        if (storedMatchesList) {
          setMatchesDetailsList(storedMatchesList);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      } finally {
        setLoadedList(true);
      }
    };

    loadMatchesList();
  }, []);

  useEffect(() => {
    if (loadedeList) {
      const saveMatchesDetailsList = async () => {
        try {
          await storage.setItem("matchesDetailsList1", matchesDetailsList);
        } catch (error) {
          console.error("Erro ao salvar dados no AsyncStorage:", error);
        }
      };

      saveMatchesDetailsList();
    }
  }, [matchesDetailsList, loadedeList]);

  useEffect(() => {
    if (!loadedeList) return;
    const fetchMatchDetails = async () => {
      const match =
        MatchDetailsIndex &&
        matchesDetailsList.find(
          (m: MatchDetailsModel) => m.match_id === MatchDetailsIndex
        );
      if (match) {
        console.log(
          "Partida Encontrada ID: " +
            MatchDetailsIndex +
            " - Tamanho da Lista: " +
            matchesDetailsList.length
        );
        setMatchDetails(match);
      } else {
        await handleSearchMatche();
      }
    };
    fetchMatchDetails();
  }, [route.params, loadedeList]);

  async function handleSearchMatche() {
    try {
      //setIsLoading(true);
      const recentMatchesUrl = `${MATCHE_DETAILS_API_BASE_URL}${MatchDetailsIndex}`;
      const matchDataResponse = await getMatchDetails(recentMatchesUrl);
      if (matchDataResponse) {
        setMatchDetails(matchDataResponse);
        addMatchToList(matchDataResponse);
        console.log("Partida buscada no servidor ID: " + MatchDetailsIndex);
      }
    } catch (error) {
      console.log(
        "Erro ao buscar detalhes da partida: ID " + MatchDetailsIndex,
        error
      );
      //setIsLoading(false);
    }
  }

  const addMatchToList = (match: MatchDetailsModel) => {
    setMatchesDetailsList((prevList) => {
      const updatedList = [...prevList, match];
      if (updatedList.length > 20) {
        return updatedList.slice(1);
      }
      return updatedList;
    });
  };

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
      {matchDetails ? (
        <View style={{ flex: 1 }}>
          <Header
            matchDetails={matchDetails}
          />
          <ScrollView style={{ marginTop: "2%" }}>
            <View style={{ alignItems: "center" }}>
              <Teams
                matchDetails={matchDetails}
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
              <View style={styles.containerItem}>
                <HeroKillsDetails
                  matchDetails={matchDetails}
                  direName={DireName ?? direName}
                  radName={RadiantName ?? radName}
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
