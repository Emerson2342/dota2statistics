import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  HeroAbilitiesDescriptionsJson,
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
  RootStackParamList,
  ThemeColor,
} from "../../services/props";
import AbilitiesDescriptionsJson from "../../components/Heroes/AbilitiesDescriptions.json";
import TalentTree from "../../components/Heroes/talentTree.jpg";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "../../constants/player";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export function Damage({
  matchDetails,
  RadName,
  DireName,
}: {
  matchDetails: MatchDetailsModel;
  RadName: string | undefined;
  DireName: string | undefined;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [heroList, setHeroList] = useState<HeroDetailsModel[]>([]);
  // setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const styles = createStyles(ColorTheme);
  // const heroList = Object.values(HeroesDetails) as HeroDetailsModel[];

  useEffect(() => {
    setTimeout(() => {
      setHeroList(Object.values(HeroesDetails) as HeroDetailsModel[]);
    }, 500);
  }, []);

  const RenderDamage = ({ players }: { players: Player[] }) => {
    const heroAbilitiesDescriptions: HeroAbilitiesDescriptionsJson =
      AbilitiesDescriptionsJson;

    var magicDamage;
    var physicalDamage: number;
    var pureDamage;
    return (
      <View style={styles.contentItem}>
        <Text style={styles.title}>
          {englishLanguage ? "Damage Received" : "Dano Recebido"}
        </Text>
        {players &&
          players.map((player: Player, index: number) => {
            const hero = heroList.find((hero) => hero.id === player.hero_id);
            let imgSource = PICTURE_HERO_BASE_URL + hero?.img;

            return (
              <View key={index}>
                {index == 0 ? (
                  <Text
                    style={[
                      styles.textTeam,
                      { borderTopWidth: 1, borderColor: ColorTheme.semilight },
                    ]}
                  >
                    {RadName ? RadName : radName}
                  </Text>
                ) : null}

                {index === 5 ? (
                  <Text
                    style={[
                      styles.textTeam,
                      { borderTopWidth: 1, borderColor: ColorTheme.semilight },
                    ]}
                  >
                    {DireName ? DireName : direName}
                  </Text>
                ) : null}

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingBottom: index == 4 ? "3%" : 0,
                  }}
                >
                  <View style={styles.imageHeroWrapper}>
                    <Image
                      style={styles.heroImage}
                      source={{ uri: imgSource }}
                    />
                  </View>

                  {/* Renderizando as habilidades recebidas */}
                  <View style={styles.imageAbilityWrapper}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {player.damage_inflictor_received &&
                        Object.entries(player.damage_inflictor_received).map(
                          ([ability, damage], index) => {
                            // Verifica se a habilidade existe no objeto
                            if (!(ability in heroAbilitiesDescriptions)) {
                              return null; // Se não existir, ignora
                            }

                            // Acessa a habilidade de forma segura
                            const abilityInfo =
                              heroAbilitiesDescriptions[ability];

                            if (abilityInfo?.dmg_type === "Physical") {
                              physicalDamage += damage;
                            }

                            return (
                              <View
                                key={index}
                                style={{ alignItems: "center", margin: 5 }}
                              >
                                {/* Imagem da Habilidade */}
                                {abilityInfo?.img && (
                                  <Image
                                    src={`${PICTURE_HERO_BASE_URL}${abilityInfo?.img}`}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 5,
                                    }}
                                  />
                                )}

                                {/* Nome da Habilidade */}
                                <Text
                                  style={{ fontSize: 12, fontWeight: "bold" }}
                                >
                                  {abilityInfo?.dname}
                                </Text>

                                {/* Tipo de Dano */}
                                <Text style={{ fontSize: 12, color: "gray" }}>
                                  {abilityInfo?.dmg_type}
                                </Text>

                                {/* Dano Recebido */}
                                <Text style={{ fontSize: 12, color: "red" }}>
                                  Dano: {damage}
                                </Text>
                              </View>
                            );
                          }
                        )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={matchDetails ? [matchDetails] : []}
        scrollEnabled={false}
        keyExtractor={(item) => item.match_id.toString()}
        renderItem={({ item }) => <RenderDamage players={item.players} />}
      />
    </View>
  );
}

const createStyles = (Colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
    },
    contentItem: {
      backgroundColor: "#fff",
      borderRadius: 9,
      padding: "1%",
    },
    title: {
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      fontSize: 20,
      color: Colors.semidark,
      marginBottom: "3%",
    },
    textTeam: {
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: Colors.semidark,
    },
    imageHeroWrapper: {
      justifyContent: "center",
      width: "13%",
    },
    heroImage: {
      width: "100%",
      aspectRatio: 1,
      alignSelf: "center",
      borderRadius: 7,
    },
    imageAbilityWrapper: {
      width: "87%",
      padding: 5,
      justifyContent: "center",
    },

    abilityImage: {
      width: "9%",
      height: 1,
      aspectRatio: 1,
      borderRadius: 50,
    },
  });
