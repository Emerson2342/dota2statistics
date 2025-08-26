import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import {
  HeroAbilitiesDescriptionsJson,
  HeroAbilitiesDescriptionsModel,
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
  ThemeColor,
} from "../../../src/services/props";
import AbilitiesList from "../../../src/components/Heroes/abilitiesIdsList.json";
import TalentTree from "../../../src/components/Heroes/talentTree.jpg";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "../../../src/constants/player";
import HeroesDetails from "../../../src/components/Heroes/HeroesDetails.json";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import AbilitiesDescriptions from "../../../src/components/Heroes/AbilitiesDescriptions.json";
import { ModalAbilityDetails } from "../../../src/components/Modals/ModalAbilityDetails";
import { useRouter } from "expo-router";

function Abilities({
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
  const router = useRouter();

  const [modalAbilityDetails, setModalAbilityDetails] = useState(false);
  const [abilityIndex, setAbilityIndex] =
    useState<HeroAbilitiesDescriptionsModel>();

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const styles = createStyles(ColorTheme);

  const heroesList = useMemo(() => {
    return Object.values(HeroesDetails) as HeroDetailsModel[];
  }, []);

  const abilitiesDescriptions = useMemo(() => {
    const abilities: HeroAbilitiesDescriptionsJson = AbilitiesDescriptions;
    return abilities;
  }, []);

  const handleAbilitiesDetails = useCallback((abilityName: string) => {
    abilityName = abilityName.replace(".png", "");
    const abilityDetails = abilitiesDescriptions[abilityName];

    if (abilityDetails) {
      setAbilityIndex(abilityDetails);
      setModalAbilityDetails(true);
    }
  }, []);

  const HandleGoToHeroDetails = (heroId: number | undefined) => {
    router.push({
      pathname: "/hero-details",
      params: {
        heroId: heroId,
      },
    });
  };

  const RenderAbilityes = useCallback(
    ({ item }: { item: MatchDetailsModel }) => {
      return (
        <View style={styles.contentItem}>
          <Text style={styles.title}>
            {englishLanguage
              ? "Skill Progression"
              : "Construção de Habilidades"}
          </Text>
          {item &&
            item.players.map((player: Player, index: number) => {
              const hero = heroesList.find(
                (hero) => hero.id === player.hero_id
              );
              let imgSource = PICTURE_HERO_BASE_URL + hero?.img;

              return (
                <View key={index}>
                  {index == 0 ? (
                    <Text
                      style={[
                        styles.textTeam,
                        {
                          borderTopWidth: 1,
                          borderColor: ColorTheme.semilight,
                        },
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
                        {
                          borderTopWidth: 1,
                          borderColor: ColorTheme.semilight,
                        },
                      ]}
                    >
                      {DireName ? DireName : direName}
                    </Text>
                  ) : (
                    <></>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      paddingBottom: index == 4 ? "3%" : 0,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => HandleGoToHeroDetails(player.hero_id)}
                      style={styles.imageHeroWrapper}
                    >
                      <Image
                        style={styles.heroImage}
                        source={{ uri: imgSource }}
                      />
                    </TouchableOpacity>
                    <View style={styles.imageAbilityWrapper}>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
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
                                  <View key={abilityIndex}>
                                    <Image
                                      style={styles.abilityImage}
                                      source={TalentTree}
                                    />
                                  </View>
                                );
                              }

                              return (
                                <TouchableOpacity
                                  key={abilityIndex}
                                  onPress={() =>
                                    handleAbilitiesDetails(abilityName)
                                  }
                                >
                                  <Image
                                    style={styles.abilityImage}
                                    source={{ uri: image }}
                                  />
                                </TouchableOpacity>
                              );
                            }
                          )}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      );
    },
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={matchDetails ? [matchDetails] : []}
        scrollEnabled={false}
        keyExtractor={(item) => item.match_id.toString()}
        renderItem={RenderAbilityes}
      />
      <Modal
        visible={modalAbilityDetails}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalAbilityDetails(false)}
      >
        <ModalAbilityDetails
          ability={abilityIndex}
          handleClose={() => setModalAbilityDetails(false)}
        />
      </Modal>
    </View>
  );
}

export const AbilitiesComponent = React.memo(Abilities);
AbilitiesComponent.displayName = "AbilitiesComponent";

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
      width: Dimensions.get("window").width * 0.07,
      height: undefined,
      aspectRatio: 1,
      borderRadius: 50,
    },
  });
