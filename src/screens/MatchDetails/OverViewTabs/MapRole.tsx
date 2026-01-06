import React from "react";
import { View, Image, Dimensions } from "react-native";
import MapImage from "@src/images/map.jpg";
import { Player } from "@src/services/props";

type MapRoleProps = {
  playersLane: Player[];
};

const width = Dimensions.get("window").width;

function MapRole({ playersLane }: MapRoleProps) {
  console.log(Image.resolveAssetSource(MapImage));

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          width: "70%",
          maxWidth: 250,
          aspectRatio: 1,
          borderRadius: 7,
        }}
      >
        <Image
          source={MapImage}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export const MapRoleComponent = React.memo(MapRole);
MapRoleComponent.displayName = "MapRoleComponent";
