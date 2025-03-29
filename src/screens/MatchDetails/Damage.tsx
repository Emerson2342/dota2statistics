import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  HeroAbilitiesDescriptionsJson,
  HeroDetailsModel,
  ItemsJson,
  ItemsModel,
  MatchDetailsModel,
  Player,
  RootStackParamList,
  ThemeColor,
} from "../../services/props";
import AbilitiesDescriptionsJson from "../../components/Heroes/AbilitiesDescriptions.json";
import ItemsList from "../../components/Itens/itemsList.json";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

  const heroAbilitiesDescriptions: HeroAbilitiesDescriptionsJson =
    AbilitiesDescriptionsJson;

  const itemsMap = Object.fromEntries(ItemsList.map((item) => [item.name, item]));

  const RenderDamage = ({ players }: { players: Player[] }) => {


    return (
      <View style={styles.contentItem}>
        <Text style={styles.title}>
          {englishLanguage ? "Damage Inflictor" : "Origem do Dano"}
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

                <View
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
                  <View style={styles.imageAbilityWrapper}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {player.damage_inflictor &&
                        Object.entries(player.damage_inflictor)
                          .sort(([a], [b]) =>
                            a === "null" ? -1 : b === "null" ? 1 : 0
                          )
                          .map(([ability, damage], index) => {
                            const abilityInfo =
                              heroAbilitiesDescriptions[ability];

                            const itemInfo = itemsMap[ability];
                            return (
                              <View
                                key={index}
                                style={{
                                  alignItems: "center",
                                  margin: 3,
                                }}
                              >
                                {abilityInfo?.img && (
                                  <Image
                                    src={`${PICTURE_HERO_BASE_URL}${abilityInfo?.img}`}
                                    style={{
                                      width:
                                        Dimensions.get("screen").width * 0.07,
                                      aspectRatio: 1,
                                      borderRadius: 5,
                                    }}
                                  />
                                )}
                                {itemInfo?.img && (
                                  <Image
                                    src={`${PICTURE_HERO_BASE_URL}${itemInfo?.img}`}
                                    style={{
                                      width:
                                        Dimensions.get("screen").width * 0.07,
                                      aspectRatio: 1,
                                      borderRadius: 5,
                                    }}
                                  />
                                )}
                                {ability === "null" ? (
                                  <MaterialCommunityIcons
                                    name="sword"
                                    size={Dimensions.get("screen").width * 0.07}
                                    color={"#000"}
                                  />
                                ) : (
                                  <></>
                                )}
                                <Text
                                  style={{
                                    fontFamily: "QuickSand-Semibold",
                                    fontSize:
                                      Dimensions.get("screen").width * 0.027,
                                    color: "#888",
                                  }}
                                >
                                  {damage.toLocaleString(
                                    englishLanguage ? "en-US" : "pt-BR"
                                  )}
                                </Text>
                              </View>
                            );
                          })}
                    </View>
                  </View>
                </View>
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
