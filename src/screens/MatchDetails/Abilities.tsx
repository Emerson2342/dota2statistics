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
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
  RootStackParamList,
  ThemeColor,
} from "../../services/props";
import AbilitiesList from "../../components/Heroes/abilitiesIdsList.json";
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

export function Abilities({
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

  const HandleGoToHeroDetails = (heroId: number | undefined) => {
    if (heroId) {
      const heroIndex = heroList.find((h) => h.id === heroId);
      if (heroIndex) {
        console.log("Herói Selecionado: " + heroIndex?.localized_name);
        navigation.navigate("HeroDetails", { heroDetails: heroIndex });
      } else {
        console.log("Hero não encontrado!");
      }
    }
  };

  const RenderAbilityes = ({ players }: { players: Player[] }) => {
    return (
      <View style={styles.contentItem}>
        <Text style={styles.title}>
          {englishLanguage ? "Skill Progression" : "Construção de Habilidades"}
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
                ) : (
                  <></>
                )}

                {index === 5 ? (
                  <Text
                    style={[
                      styles.textTeam,
                      { borderTopWidth: 1, borderColor: ColorTheme.semilight },
                    ]}
                  >
                    {DireName ? DireName : direName}
                  </Text>
                ) : (
                  <></>
                )}

                <TouchableOpacity
                  onPress={() => HandleGoToHeroDetails(player.hero_id)}
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
                      {player &&
                        player.ability_upgrades_arr &&
                        player.ability_upgrades_arr.map(
                          (ability: number, abilityIndex: number) => {
                            const abilityName: string =
                              Object.entries(AbilitiesList).find(
                                ([key, value]) => key === ability.toString()
                              )?.[1] + ".png";

                            let image = ITEM_IMAGE_BASE_URL + abilityName;
                            if (abilityName.includes("special_bonus")) {
                              return (
                                <Image
                                  key={abilityIndex}
                                  style={styles.abilityImage}
                                  source={TalentTree}
                                />
                              );
                            }

                            return (
                              <Image
                                key={abilityIndex}
                                style={styles.abilityImage}
                                source={{ uri: image }}
                              />
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
        renderItem={({ item }) => <RenderAbilityes players={item.players} />}
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
