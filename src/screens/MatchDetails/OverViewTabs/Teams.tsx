import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
  RootStackParamList,
} from "../../../services/props";
import { useSettingsContext } from "../../../context/useSettingsContext";
import { useTheme } from "../../../context/useThemeContext";
import { PICTURE_HERO_BASE_URL } from "../../../constants/player";
import HeroesDetails from "../../../components/Heroes/HeroesDetails.json";
import { Medal } from "../../../components/Medals/MedalsList";
import { createStyles } from "./TeamsStyles";
import { useNavigation } from "@react-navigation/native";
import { ModalMessage } from "../../../components/Modals/ModalMessage";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalHelpMatchDetails } from "../../../components/Modals/ModalHelpMatchDetails";
function Teams({
  matchDetails,
  PlayerIdIndex,
}: {
  matchDetails: MatchDetailsModel | null;
  PlayerIdIndex: string | null;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "PlayerProfile">>();
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const messageText = englishLanguage
    ? "This profile is private"
    : "Este perfil é privado";
  const [modalVisible, setModalVisible] = useState(false);

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";
  const winner = englishLanguage ? "Winner" : "Vencedor";

  const styles = createStyles(ColorTheme);

  const colorPercent = (percent: number): string => {
    if (percent >= 0 && percent < 20) return "#ff4d4d";
    if (percent >= 20 && percent < 35) return "#ff7934";
    if (percent >= 35 && percent < 50) return "#ffae1a";
    if (percent >= 50 && percent < 75) return "#66cc66";
    if (percent >= 75) return "green";
    return "gray";
  };

  const HandleNavigateToProfile = (playerId: number | undefined) => {
    if (playerId === undefined) {
      setModalMessageVisible(true);
    } else {
      navigation.navigate("PlayerProfile", { PlayerId: playerId.toString() });
    }
  };

  const TeamRenderItem = useCallback(
    ({
      players,
      teamName,
      radiantWin,
    }: {
      players: Player[];
      teamName: string;
      radiantWin: boolean;
    }) => {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={[styles.headerContainer]}>
            <Text
              style={[
                styles.title,
                {
                  fontSize: 13,
                  color: "#ccc",
                  display: radiantWin ? "flex" : "none",
                },
              ]}
            >
              {winner}
            </Text>
            <Text style={[styles.title, {}]}>{teamName}</Text>

            <View
              style={[
                styles.detailsContainer,
                { backgroundColor: "transparent" },
              ]}
            >
              <View style={styles.helpButton}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <MaterialCommunityIcons
                    name="help-circle"
                    color={"#fff"}
                    size={15}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.cabecalho}>
                <Text style={[styles.k, styles.textHeader]}>K/D/A</Text>
                <Text style={[styles.lhs, styles.textHeader]}>LH</Text>
                <Text style={[styles.denies, styles.textHeader]}>D</Text>
                <Text style={[styles.hDamage, styles.textHeader]}>
                  {englishLanguage ? "Heroes Damage" : "Dano Heróis"}
                </Text>
                <Text style={[styles.tDamage, styles.textHeader]}>
                  {englishLanguage ? "Tower Damage" : "Dano Torres"}
                </Text>
                <Text style={[styles.healing, styles.textHeader]}>
                  {englishLanguage ? "Heal" : "Cura"}
                </Text>
                <Text style={[styles.xp, styles.textHeader]}>XPM</Text>
                <Text style={[styles.netWorth, styles.textHeader]}>
                  {englishLanguage ? "GPM" : "OPM"}
                </Text>
              </View>
            </View>
          </View>
          {players.map((player, index) => {
            const hero = heroArray.find((hero) => hero.id === player.hero_id);

            const personaName = player.personaname
              ? player.personaname
              : englishLanguage
              ? "Private Profile"
              : "Perfil Privado";

            const playerName = player.name ? player.name : personaName;

            let imgSource = PICTURE_HERO_BASE_URL + hero?.img;

            const percentKi = player.benchmarks.kills_per_min.pct
              ? player.benchmarks.kills_per_min.pct * 100
              : 0;

            const percentLh = player.benchmarks.last_hits_per_min.pct
              ? player.benchmarks.last_hits_per_min.pct * 100
              : 0;
            const percentHer = player.benchmarks.hero_damage_per_min.pct
              ? player.benchmarks.hero_damage_per_min.pct * 100
              : 0;
            const percentTow = player.benchmarks.tower_damage.pct
              ? player.benchmarks.tower_damage.pct * 100
              : 0;
            const percentHeal = player.benchmarks.hero_healing_per_min.pct
              ? player.benchmarks.hero_healing_per_min.pct * 100
              : 0;
            const percentXp = player.benchmarks.xp_per_min.pct
              ? player.benchmarks.xp_per_min.pct * 100
              : 0;
            const percentGold = player.benchmarks.gold_per_min.pct
              ? player.benchmarks.gold_per_min.pct * 100
              : 0;

            const colorKill = colorPercent(percentKi);
            const colorLh = colorPercent(percentLh);
            const colorHero = colorPercent(percentHer);
            const colorTow = colorPercent(percentTow);
            const colorHeal = colorPercent(percentHeal);
            const colorXp = colorPercent(percentXp);
            const colorGold = colorPercent(percentGold);

            return (
              <TouchableOpacity
                onPress={() => HandleNavigateToProfile(player.account_id)}
                disabled={
                  player &&
                  player.account_id &&
                  PlayerIdIndex === player.account_id.toString()
                    ? true
                    : false
                }
                key={index}
                style={[
                  player &&
                  player.account_id &&
                  PlayerIdIndex === player.account_id.toString()
                    ? {
                        backgroundColor: "#f7eba6",
                        borderRadius: 3,
                        padding: "0.5%",
                        marginTop: index == 0 ? 0 : "1%",
                        borderTopEndRadius: index == 0 ? 0 : 3,
                        borderTopStartRadius: index === 0 ? 0 : 3,
                      }
                    : {
                        backgroundColor: "#fff",
                        marginTop: index == 0 ? 0 : "1%",
                        padding: "0.5%",
                        borderRadius: 3,
                        borderTopEndRadius: index == 0 ? 0 : 3,
                        borderTopStartRadius: index === 0 ? 0 : 3,
                      },
                  {},
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text numberOfLines={1} style={styles.lvlText}>
                    {player.level}
                  </Text>
                  <Text numberOfLines={1} style={styles.nameText}>
                    {playerName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.containerImage}>
                    <Image
                      style={styles.imageHero}
                      source={{
                        uri: imgSource,
                      }}
                    />
                    <Image
                      style={styles.imageMedal}
                      source={{
                        uri: `${Medal(player.rank_tier)}`,
                      }}
                    />
                  </View>
                  <View style={{ width: "83%" }}>
                    <View key={index}>
                      <View style={styles.infoContainer}>
                        <Text
                          style={[
                            styles.k,
                            styles.textData,
                            { flexDirection: "row" },
                          ]}
                        >
                          <Text style={{ color: "#555" }}>{player.kills}</Text>/
                          <Text style={{ color: "555" }}>{player.deaths}</Text>/
                          <Text style={{ color: "#555" }}>
                            {player.assists}
                          </Text>
                        </Text>

                        <Text style={[styles.lhs, styles.textData]}>
                          {player.last_hits}
                        </Text>
                        <Text style={[styles.denies, styles.textData]}>
                          {player.denies}
                        </Text>
                        <Text style={[styles.hDamage, styles.textData]}>
                          {player.hero_damage
                            ? player.hero_damage.toLocaleString(
                                englishLanguage ? "en-US" : "pt-BR"
                              )
                            : 0}
                        </Text>
                        <Text style={[styles.tDamage, styles.textData]}>
                          {player.tower_damage
                            ? player.tower_damage.toLocaleString(
                                englishLanguage ? "en-US" : "pt-BR"
                              )
                            : 0}
                        </Text>
                        <Text style={[styles.healing, styles.textData]}>
                          {player &&
                            player.hero_healing &&
                            player.hero_healing.toLocaleString(
                              englishLanguage ? "en-US" : "pt-BR"
                            )}
                        </Text>
                        <Text style={[styles.xp, styles.textData]}>
                          {player &&
                            player.xp_per_min &&
                            player.xp_per_min.toLocaleString(
                              englishLanguage ? "en-US" : "pt-BR"
                            )}
                        </Text>
                        <Text style={[styles.netWorth, styles.textData]}>
                          {player.gold_per_min}
                        </Text>
                      </View>
                      <View style={styles.infoContainerPercent}>
                        <Text
                          style={[
                            styles.benchKills,
                            styles.textDataPercent,
                            { color: colorKill },
                          ]}
                        >
                          {(player.benchmarks.kills_per_min.pct
                            ? player.benchmarks.kills_per_min.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                        <Text
                          style={[
                            styles.benchLhs,
                            styles.textDataPercent,
                            { color: colorLh },
                          ]}
                        >
                          {(player.benchmarks.last_hits_per_min.pct
                            ? player.benchmarks.last_hits_per_min.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                        <Text
                          style={[
                            styles.benchHerDa,
                            styles.textDataPercent,
                            { color: colorHero },
                          ]}
                        >
                          {(player.benchmarks.hero_damage_per_min.pct
                            ? player.benchmarks.hero_damage_per_min.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                        <Text
                          style={[
                            styles.benchTowDa,
                            styles.textDataPercent,
                            { color: colorTow },
                          ]}
                        >
                          {(player.benchmarks.tower_damage.pct
                            ? player.benchmarks.tower_damage.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                        <Text
                          style={[
                            styles.benchHeal,
                            styles.textDataPercent,
                            { color: colorHeal },
                          ]}
                        >
                          {(player.benchmarks.hero_healing_per_min.pct
                            ? player.benchmarks.hero_healing_per_min.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                        <Text
                          style={[
                            styles.benchXp,
                            styles.textDataPercent,
                            { color: colorXp },
                          ]}
                        >
                          {(player.benchmarks.xp_per_min.pct
                            ? player.benchmarks.xp_per_min.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                        <Text
                          style={[
                            styles.benchGold,
                            styles.textDataPercent,
                            {
                              color: colorGold,
                            },
                          ]}
                        >
                          {(player.benchmarks.gold_per_min.pct
                            ? player.benchmarks.gold_per_min.pct * 100
                            : 0
                          ).toFixed(2)}
                          %
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    },
    []
  );

  return (
    <View>
      <View style={[styles.containerItem, { backgroundColor: "transparent" }]}>
        <FlatList
          data={matchDetails ? [matchDetails] : []}
          renderItem={({ item }) => (
            <TeamRenderItem
              players={item.players.slice(0, 5)}
              teamName={matchDetails?.radiant_team?.name ?? radName}
              radiantWin={item.radiant_win}
            />
          )}
          keyExtractor={(item) => item.match_id.toString()}
          scrollEnabled={false}
        />
      </View>
      <View style={[styles.containerItem, { backgroundColor: "transparent" }]}>
        <FlatList
          data={matchDetails ? [matchDetails] : []}
          renderItem={({ item }) => (
            <TeamRenderItem
              players={item.players.slice(5, 10)}
              teamName={matchDetails?.dire_team?.name ?? direName}
              radiantWin={!item.radiant_win}
              //isRadiant={false}
            />
          )}
          keyExtractor={(item) => item.match_id.toString()}
          scrollEnabled={false}
        />
        <Modal
          transparent={true}
          visible={modalMessageVisible}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <ModalMessage
            handleClose={() => setModalMessageVisible(false)}
            title="Ops..."
            message={messageText}
          />
        </Modal>
        <Modal
          statusBarTranslucent={true}
          visible={modalVisible}
          transparent={true}
          animationType="fade"
        >
          <ModalHelpMatchDetails handleClose={() => setModalVisible(false)} />
        </Modal>
      </View>
    </View>
  );
}

export const TeamsComponent = React.memo(Teams);
TeamsComponent.displayName = "TeamsComponent";
