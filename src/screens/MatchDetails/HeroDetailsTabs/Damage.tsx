import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  HeroAbilitiesDescriptionsJson,
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
  ThemeColor,
} from "@src/services/props";
import AbilitiesDescriptionsJson from "@src/components/Heroes/AbilitiesDescriptions.json";
import ItemsList from "@src/components/Itens/itemsList.json";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EmptyImage from "@src/images/emptyImage.png";
import { TextComponent } from "@src/components/TextComponent";
import { useRouter } from "expo-router";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

function Damage({
  matchDetails,
  RadName,
  DireName,
}: {
  matchDetails: MatchDetailsModel;
  RadName: string | undefined;
  DireName: string | undefined;
}) {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const router = useRouter();
  const [heroList, setHeroList] = useState<HeroDetailsModel[]>([]);
  // setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const styles = createStyles(colorTheme);
  // const heroList = Object.values(HeroesDetails) as HeroDetailsModel[];

  useEffect(() => {
    setTimeout(() => {
      setHeroList(Object.values(HeroesDetails) as HeroDetailsModel[]);
    }, 500);
  }, []);

  const heroAbilitiesDescriptions: HeroAbilitiesDescriptionsJson =
    AbilitiesDescriptionsJson;

  const itemsMap = Object.fromEntries(
    ItemsList.map((item) => [item.name, item])
  );

  const HandleGoToHeroDetails = (heroId: number | undefined) => {
    router.push({
      pathname: "/hero-details",
      params: {
        heroId: heroId,
      },
    });
  };

  const RenderDamage = ({ players }: { players: Player[] }) => {
    return (
      <View style={styles.contentItem}>
        <TextComponent weight="bold" style={styles.title}>
          {englishLanguage ? "Damage Inflictor" : "Origem do Dano"}
        </TextComponent>
        {players &&
          players.map((player: Player, index: number) => {
            const hero = heroList.find((hero) => hero.id === player.hero_id);
            let imgSource = PICTURE_HERO_BASE_URL + hero?.img;

            return (
              <View key={index}>
                {index == 0 && (
                  <TextComponent
                    weight="bold"
                    style={[
                      styles.textTeam,
                      { borderTopWidth: 1, borderColor: colorTheme.semilight },
                    ]}
                  >
                    {RadName ? RadName : radName}
                  </TextComponent>
                )}

                {index === 5 && (
                  <TextComponent
                    weight="bold"
                    style={[
                      styles.textTeam,
                      { borderTopWidth: 1, borderColor: colorTheme.semilight },
                    ]}
                  >
                    {DireName ? DireName : direName}
                  </TextComponent>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingBottom: index == 4 ? "3%" : 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => HandleGoToHeroDetails(hero?.id)}
                    style={styles.imageHeroWrapper}
                  >
                    <Image
                      style={styles.heroImage}
                      source={{ uri: imgSource }}
                    />
                  </TouchableOpacity>
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
                                  <View>
                                    <Image
                                      source={EmptyImage}
                                      style={{
                                        width:
                                          Dimensions.get("screen").width * 0.07,
                                        height: undefined,
                                        aspectRatio: 1,
                                        borderRadius: 5,
                                        position: "absolute",
                                      }}
                                    />
                                    <Image
                                      src={`${PICTURE_HERO_BASE_URL}${abilityInfo?.img}`}
                                      style={{
                                        width:
                                          Dimensions.get("screen").width * 0.07,
                                        aspectRatio: 1,
                                        borderRadius: 5,
                                      }}
                                    />
                                  </View>
                                )}
                                {itemInfo?.img && (
                                  <View>
                                    <Image
                                      source={EmptyImage}
                                      style={{
                                        width:
                                          Dimensions.get("screen").width * 0.07,
                                        height: undefined,
                                        aspectRatio: 1,
                                        borderRadius: 5,
                                        position: "absolute",
                                      }}
                                    />
                                    <Image
                                      src={`${PICTURE_HERO_BASE_URL}${itemInfo?.img}`}
                                      style={{
                                        width:
                                          Dimensions.get("screen").width * 0.07,
                                        aspectRatio: 1,
                                        borderRadius: 5,
                                      }}
                                    />
                                  </View>
                                )}
                                {ability === "null" && (
                                  <MaterialCommunityIcons
                                    name="sword"
                                    size={Dimensions.get("screen").width * 0.07}
                                    color={"#000"}
                                  />
                                )}
                                {!itemInfo &&
                                  !abilityInfo &&
                                  ability != "null" && (
                                    <Image
                                      source={EmptyImage}
                                      style={{
                                        width:
                                          Dimensions.get("screen").width * 0.07,
                                        height: undefined,
                                        aspectRatio: 1,
                                        borderRadius: 5,
                                      }}
                                    />
                                  )}
                                <TextComponent
                                  weight="semibold"
                                  style={{
                                    fontSize:
                                      Dimensions.get("screen").width * 0.027,
                                    color: "#888",
                                  }}
                                >
                                  {damage.toLocaleString(
                                    englishLanguage ? "en-US" : "pt-BR"
                                  )}
                                </TextComponent>
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

export const DamageComponent = React.memo(Damage);
DamageComponent.displayName = "DamageComponent";

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
      textAlign: "center",
      fontSize: 20,
      color: Colors.semidark,
      marginBottom: "3%",
    },
    textTeam: {
      textAlign: "center",
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
