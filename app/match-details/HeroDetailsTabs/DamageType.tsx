import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import {
  HeroAbilitiesDescriptionsJson,
  HeroDetailsModel,
  MatchDetailsModel,
  Player,
  ThemeColor,
} from "../../../src/services/props";
import AbilitiesDescriptionsJson from "../../../src/components/Heroes/AbilitiesDescriptions.json";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import HeroesDetails from "../../../src/components/Heroes/HeroesDetails.json";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";

type DamageType = "Magical" | "Physical" | "Pure";
type DamageText = {
  Physical: number;
  Magical: number;
  Pure: number;
};
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
  blade_mail: "Physical",
  crippling_crossbow: "Magical",
};

function DamageType({
  matchDetails,
  RadName,
  DireName,
  damageInflictor,
}: {
  matchDetails: MatchDetailsModel;
  RadName: string | undefined;
  DireName: string | undefined;
  damageInflictor: string;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const [heroList, setHeroList] = useState<HeroDetailsModel[]>([]);

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const styles = createStyles(ColorTheme);
  const title =
    damageInflictor === "caused"
      ? englishLanguage
        ? "Type of Damage Caused"
        : "Tipo de Dano Causado"
      : englishLanguage
      ? "Type of Damage Received"
      : "Tipo de Dano Recebido";

  useEffect(() => {
    setTimeout(() => {
      setHeroList(Object.values(HeroesDetails) as HeroDetailsModel[]);
    }, 500);
  }, []);

  const heroAbilitiesDescriptions: HeroAbilitiesDescriptionsJson =
    AbilitiesDescriptionsJson;

  const TextDamage = ({ Physical, Magical, Pure }: DamageText) => {
    return (
      <View>
        <Text style={{ fontFamily: "QuickSand-Bold", color: "#555" }}>
          {englishLanguage ? "Physical: " : "Físico: "}
          <Text style={{ color: "#aaa" }}>
            {Physical.toLocaleString(englishLanguage ? "en-USA" : "pt-BR")}
          </Text>
        </Text>
        <Text style={{ fontFamily: "QuickSand-Bold", color: "#555" }}>
          {englishLanguage ? "Magical: " : "Mágico: "}
          <Text style={{ color: "#aaa" }}>
            {Magical.toLocaleString(englishLanguage ? "en-USA" : "pt-BR")}
          </Text>
        </Text>
        <Text style={{ fontFamily: "QuickSand-Bold", color: "#555" }}>
          {englishLanguage ? "Pure: " : "Puro: "}
          <Text style={{ color: "#aaa" }}>
            {Pure.toLocaleString(englishLanguage ? "en-USA" : "pt-BR")}
          </Text>
        </Text>
      </View>
    );
  };

  const RenderDamage = ({
    players,
    teamName,
  }: {
    players: Player[];
    teamName: string;
  }) => {
    return (
      <View style={styles.contentItem}>
        {players &&
          players.map((player: Player, index: number) => {
            const hero = heroList.find((hero) => hero.id === player.hero_id);
            let imgSource = PICTURE_HERO_BASE_URL + hero?.img;
            const damage =
              damageInflictor === "caused"
                ? player.damage_inflictor
                : player.damage_inflictor_received;

            const totalDamage = damage
              ? Object.entries(damage).reduce(
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
                <Text
                  numberOfLines={1}
                  style={[
                    styles.textTeam,
                    {
                      borderColor: ColorTheme.semilight,
                      display: index === 0 ? "flex" : "none",
                    },
                  ]}
                >
                  {teamName}
                </Text>
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
                      }}
                    >
                      <TextDamage {...totalDamage} />
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
      <Text style={styles.title}>{title}</Text>
      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={matchDetails ? [matchDetails] : []}
          scrollEnabled={false}
          keyExtractor={(item) => item.match_id.toString()}
          renderItem={({ item }) => (
            <RenderDamage
              players={item.players.slice(0, 5)}
              teamName={RadName ?? radName}
            />
          )}
        />
        <FlatList
          data={matchDetails ? [matchDetails] : []}
          scrollEnabled={false}
          keyExtractor={(item) => item.match_id.toString()}
          renderItem={({ item }) => (
            <RenderDamage
              players={item.players.slice(5, 10)}
              teamName={DireName ?? direName}
            />
          )}
        />
      </View>
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
      paddingBottom: "3%",
      borderBottomWidth: 1,
      borderColor: Colors.semidark,
      width: "95%",
      alignSelf: "center",
    },
    textTeam: {
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: Colors.semidark,
    },
    imageHeroWrapper: {
      justifyContent: "center",
      width: "35%",
    },
    heroImage: {
      width: "70%",
      aspectRatio: 1,
      alignSelf: "center",
      borderRadius: 7,
    },
    imageAbilityWrapper: {
      width: "65%",
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
