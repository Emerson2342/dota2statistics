import { View, Text, Image } from "react-native";
import {
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "../../../../../src/services/props";
import { ITEM_IMAGE_BASE_URL } from "../../../../../src/constants/player";
import EmptyImage from "../../../../images/emptyImage.png";
import { createStyles } from "../styles";
import { TeamSide } from "../../../../../src/services/enum";

type HabilitiesProps = {
  label: string;
  fight: TeamFightModel;
  colors: ThemeColor;
  team: TeamSide;
};

export const AbilitiesUsages = ({
  label,
  fight,
  colors,
  team,
}: HabilitiesProps) => {
  const styles = createStyles(colors);

  const [start, end] = team === TeamSide.Radiant ? [0, 5] : [5, 10];

  return (
    <>
      <Text style={styles.textLabel}>{label}</Text>
      <View style={{ flexDirection: "row" }}>
        {fight.players
          ?.slice(start, end)
          .map((player: PlayerTeamFight, indexPlayer: number) => {
            const abilities = Object.entries(player.ability_uses);

            if (abilities.length === 0)
              return <View key={indexPlayer + 139} style={styles.itemImage} />;

            return (
              <View key={indexPlayer}>
                {Object.entries(player.ability_uses).map(
                  (
                    [abilityName, usageCount]: [string, number],
                    index: number
                  ) => {
                    const abilityImage =
                      ITEM_IMAGE_BASE_URL + abilityName + ".png";

                    return (
                      <View
                        key={index}
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={EmptyImage}
                          style={[styles.itemImage, { position: "absolute" }]}
                        />
                        <Image
                          source={{ uri: abilityImage }}
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
    </>
  );
};
