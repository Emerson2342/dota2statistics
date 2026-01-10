import React, { useMemo } from "react";
import { View, Image, Dimensions } from "react-native";
import MapImage from "@src/images/map.jpg";
import { HeroDetailsModel, Player } from "@src/services/props";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { getHeroPosition } from "@src/utils/heroMapPosition";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

type MapRoleProps = {
  playersLane: Player[];
  heroesDetails: HeroDetailsModel[];
  radName: string;
  direName: string;
  radWin: boolean;
};

const width = Dimensions.get("window").width;

type HeroPos = {
  icon: string;
  lane: number;
};

function MapRole({
  playersLane,
  heroesDetails,
  direName,
  radName,
  radWin,
}: MapRoleProps) {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);
  const herosPos = useMemo(() => {
    let array: HeroPos[] = [];
    playersLane.map((item, index) => {
      array.push({
        icon:
          heroesDetails.find((h) => h.id === playersLane[index].hero_id)
            ?.icon ?? "",
        lane: item.lane ?? 0,
      });
    });
    return array;
  }, [playersLane]);

  const invalidLaneData = herosPos.every((item) => item.lane === 0);

  const radWonText = englishLanguage
    ? `Winner: ${direName}`
    : `Vencedor: ${radName}`;
  const direWonText = englishLanguage
    ? `Winner: ${radName}`
    : `Vencedor: ${direName}`;

  if (invalidLaneData)
    return (
      <TextComponent
        weight="bold"
        style={{
          textAlign: "center",
          color: colorTheme.semidark,
          marginVertical: 7,
          fontSize: 17,
        }}
      >
        {radWin ? radWonText : direWonText}
      </TextComponent>
    );

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginVertical: 7,
      }}
    >
      {!radWin && (
        <TextComponent
          weight="bold"
          style={{ color: colorTheme.semidark, marginBottom: 5, fontSize: 17 }}
          children={direWonText}
        />
      )}
      <View
        style={{
          width: width * 0.9,
          height: width * 0.9,
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: 1,
          position: "relative",
        }}
      >
        {herosPos.map((item, index) => {
          const img = PICTURE_HERO_BASE_URL + item?.icon;

          const sameLaneIndex = herosPos
            .slice(0, index)
            .filter((h) => h.lane === item.lane).length;

          const heroPosition = getHeroPosition(item.lane, index, sameLaneIndex);
          return (
            <Image
              key={item.icon}
              source={{ uri: img }}
              style={[
                {
                  position: "absolute",
                  zIndex: 999,
                  aspectRatio: 1,
                  width: width * 0.1,
                },
                heroPosition,
              ]}
            />
          );
        })}
        <Image
          source={MapImage}
          style={{
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: 15,
            position: "absolute",
          }}
          resizeMode="contain"
        />
      </View>
      {radWin && (
        <TextComponent
          weight="bold"
          style={{ color: colorTheme.semidark, marginTop: 5, fontSize: 17 }}
          children={radWonText}
        />
      )}
    </View>
  );
}

export const MapRoleComponent = React.memo(MapRole);
MapRoleComponent.displayName = "MapRoleComponent";
