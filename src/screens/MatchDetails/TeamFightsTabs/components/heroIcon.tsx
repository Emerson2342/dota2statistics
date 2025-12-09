import { View, Image } from "react-native";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { TeamSide } from "@src/services/enum";
import {
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "@src/services/props";
import { createStyles } from "../styles";

type TeamHeroesProps = {
  fight: TeamFightModel;
  team: TeamSide;
  heroNames: string[];
  color: ThemeColor;
};

export const RenderHeroIcon = ({
  fight,
  team,
  heroNames,
  color,
}: TeamHeroesProps) => {
  const [start, end] = team === TeamSide.Radiant ? [0, 5] : [5, 10];
  const styles = createStyles(color);
  return (
    <>
      {fight.players
        ?.slice(start, end)
        .map((player: PlayerTeamFight, indexPlayer: number) => {
          const heroName = heroNames[start + indexPlayer];

          let imgSource =
            PICTURE_HERO_BASE_URL +
            "/apps/dota2/images/dota_react/heroes/" +
            heroName +
            ".png?";

          return (
            <View
              style={[
                styles.itemImage,
                {
                  backgroundColor: player.deaths > 0 ? "red" : "transparent",
                  overflow: "hidden",
                },
              ]}
              key={indexPlayer}
            >
              <Image
                source={{ uri: imgSource }}
                style={[
                  styles.itemImage,
                  { opacity: player.deaths > 0 ? 0.45 : 1 },
                ]}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: player.deaths > 0 ? "flex" : "none",
                }}
              >
                <View
                  style={{
                    width: "120%",
                    height: 1.5,
                    backgroundColor: "#000",
                    transform: [{ rotate: "45deg" }],
                  }}
                />
              </View>
            </View>
          );
        })}
    </>
  );
};
