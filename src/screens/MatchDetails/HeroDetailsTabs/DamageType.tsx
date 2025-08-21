import React, { useCallback, useEffect, useState } from "react";
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
} from "../../../services/props";
import AbilitiesDescriptionsJson from "../../../components/Heroes/AbilitiesDescriptions.json";
import ItemsList from "../../../components/Itens/itemsList.json";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "../../../constants/player";
import HeroesDetails from "../../../components/Heroes/HeroesDetails.json";
import { useSettingsContext } from "../../../context/useSettingsContext";
import { useTheme } from "../../../context/useThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EmptyImage from "../../../images/emptyImage.png";

type DamageType = "Magical" | "Physical" | "Pure";
const itemDamageTypes: Record<string, DamageType> = {
  radiance: "Magical",
  maelstrom: "Magical",
  mjollnir: "Magical",
  gleipnir: "Magical",
  witch_blade: "Magical",
  urn_of_shadows: "Magical",
  spirit_vessel: "Magical",
  dagon: "Magical",
  ethereal_blade: "Magical",
  meteor_hammer: "Magical",
  shivas_guard: "Magical",
  chipped_vest: "Physical",
  searing_signet: "Physical",
  blood_grenade: "Magical",
  dust_of_appearance: "Magical",
  devastator: "Magical",
};

function DamageType({
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

  const RenderDamage = ({ players }: { players: Player[] }) => {
    return (
      <View style={styles.contentItem}>
        <Text style={styles.title}>
          {englishLanguage ? "Damage Type Caused" : "Type de Dano Causado"}
        </Text>
        {players &&
          players.map((player: Player, index: number) => {
            const hero = heroList.find((hero) => hero.id === player.hero_id);
            let imgSource = PICTURE_HERO_BASE_URL + hero?.img;

            const totalDamage = player.damage_inflictor
              ? Object.entries(player.damage_inflictor).reduce(
                  (acc, [ability, value]) => {
                    let dmgType: "Magical" | "Physical" | "Pure" | undefined;

                    if (ability === "null") {
                      dmgType = "Physical";
                    } else if (itemDamageTypes[ability]) {
                      dmgType = itemDamageTypes[ability];
                    } else {
                      const abilityInfo = heroAbilitiesDescriptions[ability];
                      dmgType = abilityInfo?.dmg_type as
                        | "Magical"
                        | "Physical"
                        | "Pure"
                        | undefined;
                    }

                    if (dmgType) {
                      acc[dmgType] = (acc[dmgType] || 0) + value;
                    }

                    return acc;
                  },
                  { Physical: 0, Magical: 0, Pure: 0 }
                )
              : { Physical: 0, Magical: 0, Pure: 0 };

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

                {index === 5 && (
                  <Text
                    style={[
                      styles.textTeam,
                      { borderTopWidth: 1, borderColor: ColorTheme.semilight },
                    ]}
                  >
                    {DireName ? DireName : direName}
                  </Text>
                )}

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
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: 23,
                      }}
                    >
                      <Text>{JSON.stringify(totalDamage, null, 2)}</Text>
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

export const DamageTypeComponent = React.memo(DamageType);
DamageTypeComponent.displayName = "DamageComponent";

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
