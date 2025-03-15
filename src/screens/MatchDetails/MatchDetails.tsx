import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { createStyles } from "./MatchDetailsStyles";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
} from "react-native-tab-view";
import {
  GoldPlayers,
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
import { GraficsGoldAndXpTeam } from "./GraficsGoldAndXpTeam";
import { Abilities } from "./Abilities";
import { Items } from "./Items";
import { Header } from "./Header";
import { Teams } from "./Teams";
import { getMatchDetails } from "../../../src/API";
import { AsyncStorageService } from "../../../src/services/StorageService";
import { HeroKillsDetails } from "./KillsDetails";
import { Damage } from "./Damage";
import { GraficsGoldPlayers } from "./GraficsGoldPlayers";
import { Snackbar } from "react-native-paper";
import { on } from "events";

export const MatchDetails = ({ route }: MatchDetailsProps) => {
  const { MatchDetailsIndex, PlayerIdIndex, LobbyType, GameMode } =
    route.params;

  const { englishLanguage } = useSettingsContext();
  const [matchesDetailsList, setMatchesDetailsList] = useState<
    MatchDetailsModel[]
  >([]);
  const [loadedeList, setLoadedList] = useState(false);

  const storage = useMemo(() => new AsyncStorageService(), []);

  const [refreshing, setRefreshing] = useState(false);

  const { ColorTheme } = useTheme();

  const [matchDetails, setMatchDetails] = useState<MatchDetailsModel | null>(
    null
  );

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderScene1 = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "first":
          return matchDetails ? <HomeComponent /> : <LoadingMatchDetails />;
        case "second":
          return matchDetails ? <HomeComponent1 /> : <LoadingMatchDetails />;
        default:
          return null;
      }
    },
    [matchDetails, refreshing]
  );

  const LoadingMatchDetails = () => {
    return (
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
    );
  };

  const HomeComponent = React.memo(() => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Header
            matchDetails={matchDetails}
            lobbyType={LobbyType}
            gameMode={GameMode}
          />
          <Teams matchDetails={matchDetails} PlayerIdIndex={PlayerIdIndex} />
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
                <GraficsGoldAndXpTeam
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
  });

  const HomeComponent1 = React.memo(() => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={[styles.containerItem, { marginTop: "3%" }]}>
            {matchDetails ? (
              <HeroKillsDetails
                matchDetails={matchDetails}
                radName={matchDetails?.radiant_team?.name ?? radName}
                direName={matchDetails?.dire_team?.name ?? direName}
              />
            ) : null}
          </View>
          {matchDetails && matchDetails.players[0]?.damage_inflictor ? (
            <View style={styles.containerItem}>
              <Damage
                RadName={matchDetails?.radiant_team?.name ?? radName}
                DireName={matchDetails?.dire_team?.name ?? direName}
                matchDetails={matchDetails}
              />
            </View>
          ) : null}
          <View style={styles.containerItem}>
            {matchDetails ? (
              <Items
                playerIndex={PlayerIdIndex}
                matchDetails={matchDetails}
                RadName={matchDetails?.radiant_team?.name ?? radName}
                DireName={matchDetails?.dire_team?.name ?? direName}
              />
            ) : null}
          </View>

          {matchDetails &&
            matchDetails.players.length > 0 &&
            matchDetails.players[0].gold_t &&
            matchDetails.players[0].gold_t.length > 0 ? (
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
              <GraficsGoldPlayers
                matchDetails={matchDetails}
                RadiantName={matchDetails?.radiant_team?.name ?? radName}
                DireName={matchDetails?.dire_team?.name ?? direName}
              />
            </View>
          ) : null}
        </ScrollView>
        <BannerAds />
      </View>
    );
  });

  const routes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "second",
      title: englishLanguage ? "Hero Details" : "Detalhes por Herói",
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    const match =
      MatchDetailsIndex &&
      matchesDetailsList.find(
        (m: MatchDetailsModel) => m.match_id === MatchDetailsIndex
      );
    if (match) {
      setMatchDetails(null);
      const prevList = matchesDetailsList.filter(
        (m) => m.match_id != match.match_id
      );
      setMatchesDetailsList(prevList);
      await handleSearchMatche();
    }
    setRefreshing(false);
  };

  const radName = useMemo(
    () => (englishLanguage ? "Radiant" : "Iluminados"),
    [englishLanguage]
  );
  const direName = useMemo(
    () => (englishLanguage ? "Dire" : "Temidos"),
    [englishLanguage]
  );

  const styles = useMemo(() => createStyles(ColorTheme), [ColorTheme]);
  const heroArray = useMemo(
    () => Object.values(HeroesDetails) as HeroDetailsModel[],
    [HeroesDetails]
  );

  useEffect(() => {
    if (!matchDetails) return;
  }, [matchDetails]);

  useEffect(() => {
    const loadMatchesList = async () => {
      try {
        const storedMatchesList = await storage.getItem<MatchDetailsModel[]>(
          "matchesDetailsList"
        );
        if (storedMatchesList) {
          // Evita atualizar o estado se o valor for igual ao anterior
          setMatchesDetailsList((prevList) => {
            if (
              JSON.stringify(prevList) !== JSON.stringify(storedMatchesList)
            ) {
              return storedMatchesList;
            }
            return prevList;
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      } finally {
        setLoadedList(true);
      }
    };

    loadMatchesList();
  }, []);

  const saveMatchesDetailsList = async () => {
    try {
      await storage.setItem("matchesDetailsList", matchesDetailsList);
    } catch (error) {
      console.error("Erro ao salvar dados no AsyncStorage:", error);
    }
  };

  useEffect(() => {
    if (loadedeList && matchesDetailsList.length > 0) {
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

    const renderItemBans = ({ item }: { item: MatchDetailsModel }) => {
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
    };

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
      renderItemBans,
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
    renderItemBans,
  } = stats;

  //Tab-View

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "orange",
      }}
      activeColor={"#fff"}
      inactiveColor={"#888"}
      style={{
        backgroundColor: ColorTheme.semidark,

      }}
    />
  );

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene1}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      commonOptions={{
        labelStyle: {
          fontSize: Dimensions.get("screen").width * 0.037,
          fontFamily: "QuickSand-Bold",
        },
      }}
    />
  );
};
