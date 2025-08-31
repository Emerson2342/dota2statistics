import { View, Text, Image } from "react-native";
import {
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "../../../../../src/services/props";
import { createStyles } from "../styles";
import { PICTURE_HERO_BASE_URL } from "../../../../../src/constants/player";
import EmptyImage from "../../../../images/emptyImage.png";
import { TeamSide } from "../../../../../src/services/enum";

type ItemsUsageProps = {
  label: string;
  color: ThemeColor;
  fight: TeamFightModel;
  team: TeamSide;
};

export const ItemsUsages = ({ label, color, fight, team }: ItemsUsageProps) => {
  const styles = createStyles(color);
  const [start, end] = team === TeamSide.Radiant ? [0, 5] : [5, 10];

  return (
    <>
      <Text style={styles.textLabel}>{label}</Text>
      <View style={{ flexDirection: "row" }}>
        {fight.players
          ?.slice(start, end)
          .map((player: PlayerTeamFight, indexPlayerItem: number) => {
            const items = Object.entries(player.item_uses);

            if (items.length === 0)
              return (
                <View key={indexPlayerItem + 331} style={styles.itemImage} />
              );

            return (
              <View key={indexPlayerItem}>
                {Object.entries(player?.item_uses).map(
                  ([itemName, usageCount]: [string, number], index: number) => {
                    const itemImage =
                      PICTURE_HERO_BASE_URL +
                      "/apps/dota2/images/dota_react/items/" +
                      itemName +
                      ".png";

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
                          source={{ uri: itemImage }}
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
