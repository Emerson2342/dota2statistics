import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import {
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "../../../../../src/services/props";
import { PICTURE_HERO_BASE_FULL_URL } from "../../../../../src/constants/player";
import { TeamSide } from "../../../../../src/services/enum";
import { createStyles } from "../styles";

type ProcessedFight = TeamFightModel & {
  formattedTime: string;
  endTime: string;
  damageRad: { y: number }[];
  damageDire: { y: number }[];
  goldRad: { y: number }[];
  goldDire: { y: number }[];
  xpRad: { y: number }[];
  xpDire: { y: number }[];
  healingRad: { y: number }[];
  healingDire: { y: number }[];
  emptyRadKilledList?: boolean;
  emptyDireKilledList?: boolean;
};

type KillsImageProps = {
  fight: ProcessedFight;
  label: string;
  color: ThemeColor;
  team: TeamSide;
};

export const KillsImage = ({ fight, label, color, team }: KillsImageProps) => {
  const [start, end] = team === TeamSide.Radiant ? [0, 5] : [5, 10];
  const styles = createStyles(color);

  return (
    <>
      {!fight.emptyRadKilledList && (
        <View>
          <Text style={styles.textLabel}>{label}</Text>
          <View style={{ flexDirection: "row" }}>
            {fight.players
              ?.slice(start, end)
              .map((player: PlayerTeamFight, indexPlayer: number) => {
                const heroesKilled = Object.entries(player.killed);
                if (heroesKilled.length === 0)
                  return (
                    <View key={indexPlayer + 139} style={styles.itemImage} />
                  );

                return (
                  <View key={indexPlayer}>
                    {Object.entries(player.killed).map(
                      (
                        [heroKilled, usageCount]: [string, number],
                        index: number
                      ) => {
                        const heroName = heroKilled.replace(
                          "npc_dota_hero_",
                          ""
                        );
                        const heroImg =
                          PICTURE_HERO_BASE_FULL_URL + heroName + ".png";

                        return (
                          <View
                            key={index}
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={{ uri: heroImg }}
                              style={styles.itemImage}
                            />
                          </View>
                        );
                      }
                    )}
                  </View>
                );
              })}
          </View>
        </View>
      )}
    </>
  );
};
