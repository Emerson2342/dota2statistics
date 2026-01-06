import React from "react";
import { View, Image, Dimensions } from "react-native";
import MapImage from "@src/images/map.jpg";
import { HeroDetailsModel, Player } from "@src/services/props";
import { TextComponent } from "@src/components/TextComponent";

type MapRoleProps = {
  playersLane: Player[];
  heroesDetails: HeroDetailsModel[];
};

const width = Dimensions.get("window").width;

function MapRole({ playersLane, heroesDetails }: MapRoleProps) {
  const hero = heroesDetails.find((h) => h.id === playersLane[0].hero_id);
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginVertical: 7,
      }}
    >
      <View
        style={{
          width: width * 0.75,
          aspectRatio: 1,
          borderRadius: 7,
        }}
      >
        <TextComponent
          weight="bold"
          style={{ position: "absolute", zIndex: 15, color: "red", left: 15 }}
        >
          {hero?.localized_name}
        </TextComponent>
        <Image
          source={MapImage}
          style={{ width: "100%", height: "100%", borderRadius: 15 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export const MapRoleComponent = React.memo(MapRole);
MapRoleComponent.displayName = "MapRoleComponent";
