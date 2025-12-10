import React, { useCallback, useState } from "react";
import { View, Image, FlatList, Modal, TouchableOpacity } from "react-native";
import {
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
} from "@src//services/props";
import { useTheme } from "@src/context/useThemeContext";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import { Medal } from "@src/components/Medals/MedalsList";
import { createStyles } from "./TeamsStyles";
import { ModalMessage } from "@src/components/Modals/ModalMessage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalHelpMatchDetails } from "@src/components/Modals/ModalHelpMatchDetails";
import { useRouter } from "expo-router";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";

const colorPercent = (percent: number): string => {
  if (percent >= 0 && percent < 20) return "#ff4d4d";
  if (percent >= 20 && percent < 35) return "#ff7934";
  if (percent >= 35 && percent < 50) return "#ffae1a";
  if (percent >= 50 && percent < 75) return "#66cc66";
  if (percent >= 75) return "green";
  return "gray";
};

function Teams({
  matchDetails,
  PlayerIdIndex,
  radName,
  direName,
}: {
  matchDetails: MatchDetailsModel | null;
  PlayerIdIndex: string | undefined;
  radName: string;
  direName: string;
}) {
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
  const router = useRouter();

  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const messageText = englishLanguage
    ? "This profile is private"
    : "Este perfil é privado";
  const [modalVisible, setModalVisible] = useState(false);

  const winner = englishLanguage ? "Winner" : "Vencedor";

  const styles = createStyles(ColorTheme);

  const HandleNavigateToProfile = (playerId: number | undefined) => {
    if (playerId === undefined) {
      setModalMessageVisible(true);
    } else {
      router.push({
        pathname: "/player-profile",
        params: {
          playerId: playerId.toString(),
        },
      });
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
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={[styles.headerContainer]}>
            <TextComponent
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
            </TextComponent>
            <TextComponent weight="semibold" style={styles.title}>
              {teamName}
            </TextComponent>

            <View style={[styles.detailsContainer]}>
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
                <TextComponent
                  weight="bold"
                  style={[styles.k, styles.textHeader]}
                >
                  K/D/A
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.lhs, styles.textHeader]}
                >
                  LH
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.denies, styles.textHeader]}
                >
                  D
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.hDamage, styles.textHeader]}
                >
                  {englishLanguage ? "Heroes Damage" : "Dano Heróis"}
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.tDamage, styles.textHeader]}
                >
                  {englishLanguage ? "Tower Damage" : "Dano Torres"}
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.healing, styles.textHeader]}
                >
                  {englishLanguage ? "Heal" : "Cura"}
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.xp, styles.textHeader]}
                >
                  XPM
                </TextComponent>
                <TextComponent
                  weight="bold"
                  style={[styles.netWorth, styles.textHeader]}
                >
                  {englishLanguage ? "GPM" : "OPM"}
                </TextComponent>
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
                        //borderRadius: 3,
                        padding: "0.5%",
                        borderBottomWidth: index === 4 ? 0 : 1,
                        borderColor: "#ccc",
                        borderBottomEndRadius: index === 4 ? 7 : 0,
                        borderBottomStartRadius: index === 4 ? 7 : 0,
                      }
                    : {
                        backgroundColor: "#fff",
                        // marginTop: index == 0 ? 0 : "1%",
                        padding: "0.5%",
                        borderBottomWidth: index === 4 ? 0 : 1,
                        borderColor: "#ccc",
                        borderBottomEndRadius: index === 4 ? 7 : 0,
                        borderBottomStartRadius: index === 4 ? 7 : 0,
                      },
                  {},
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <TextComponent
                    weight="bold"
                    numberOfLines={1}
                    style={styles.lvlText}
                  >
                    {player.level}
                  </TextComponent>
                  <TextComponent
                    weight="bold"
                    numberOfLines={1}
                    style={styles.nameText}
                  >
                    {playerName}
                  </TextComponent>
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
                  <View style={{ width: "85%" }}>
                    <View key={index}>
                      <View style={styles.infoContainer}>
                        <TextComponent
                          weight="bold"
                          style={[
                            styles.k,
                            styles.textData,
                            { flexDirection: "row" },
                          ]}
                        >
                          <TextComponent
                            weight="bold"
                            style={{ color: "#555" }}
                          >
                            {player.kills}
                          </TextComponent>
                          /
                          <TextComponent weight="bold" style={{ color: "555" }}>
                            {player.deaths}
                          </TextComponent>
                          /
                          <TextComponent
                            weight="bold"
                            style={{ color: "#555" }}
                          >
                            {player.assists}
                          </TextComponent>
                        </TextComponent>

                        <TextComponent
                          weight="bold"
                          style={[styles.lhs, styles.textData]}
                        >
                          {player.last_hits}
                        </TextComponent>
                        <TextComponent
                          weight="bold"
                          style={[styles.denies, styles.textData]}
                        >
                          {player.denies}
                        </TextComponent>
                        <TextComponent
                          weight="bold"
                          style={[styles.hDamage, styles.textData]}
                        >
                          {player.hero_damage
                            ? player.hero_damage.toLocaleString(
                                englishLanguage ? "en-US" : "pt-BR"
                              )
                            : 0}
                        </TextComponent>
                        <TextComponent
                          weight="bold"
                          style={[styles.tDamage, styles.textData]}
                        >
                          {player.tower_damage
                            ? player.tower_damage.toLocaleString(
                                englishLanguage ? "en-US" : "pt-BR"
                              )
                            : 0}
                        </TextComponent>
                        <TextComponent
                          weight="bold"
                          style={[styles.healing, styles.textData]}
                        >
                          {player &&
                            player.hero_healing &&
                            player.hero_healing.toLocaleString(
                              englishLanguage ? "en-US" : "pt-BR"
                            )}
                        </TextComponent>
                        <TextComponent
                          weight="bold"
                          style={[styles.xp, styles.textData]}
                        >
                          {player &&
                            player.xp_per_min &&
                            player.xp_per_min.toLocaleString(
                              englishLanguage ? "en-US" : "pt-BR"
                            )}
                        </TextComponent>
                        <TextComponent
                          weight="bold"
                          style={[styles.netWorth, styles.textData]}
                        >
                          {player.gold_per_min}
                        </TextComponent>
                      </View>
                      <View style={styles.infoContainerPercent}>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
                        <TextComponent
                          weight="bold"
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
                        </TextComponent>
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
      <View style={styles.containerItem}>
        <FlatList
          data={matchDetails ? [matchDetails] : []}
          renderItem={({ item }) => (
            <TeamRenderItem
              players={item.players.slice(0, 5)}
              teamName={radName}
              radiantWin={item.radiant_win}
            />
          )}
          keyExtractor={(item) => item.match_id.toString()}
          scrollEnabled={false}
        />
      </View>
      <View style={[styles.containerItem]}>
        <FlatList
          data={matchDetails ? [matchDetails] : []}
          renderItem={({ item }) => (
            <TeamRenderItem
              players={item.players.slice(5, 10)}
              teamName={direName}
              radiantWin={!item.radiant_win}
            />
          )}
          keyExtractor={(item) => item.match_id.toString()}
          scrollEnabled={false}
        />
      </View>
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
  );
}

export const TeamsComponent = React.memo(Teams);
TeamsComponent.displayName = "TeamsComponent";
