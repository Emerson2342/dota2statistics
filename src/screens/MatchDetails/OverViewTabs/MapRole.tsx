import React, { useMemo } from "react";
import { View, Image, Dimensions } from "react-native";
import MapImage from "@src/images/map.jpg";
import { HeroDetailsModel, Player } from "@src/services/props";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { getHeroPosition } from "@src/utils/heroMapPosition";

type MapRoleProps = {
  playersLane: Player[];
  heroesDetails: HeroDetailsModel[];
};

const width = Dimensions.get("window").width;

type HeroPos = {
  icon: string;
  lane: number
}

function MapRole({ playersLane, heroesDetails }: MapRoleProps) {

  const herosPos = useMemo(() => {
    let array: HeroPos[] = []
    playersLane.map((item, index) => {
      array.push({ icon: heroesDetails.find((h) => h.id === playersLane[index].hero_id)?.icon ?? "", lane: item.lane ?? 0 })
    })
    return array;
  }, [playersLane])


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
          width: width * 0.9,
          height: width * 0.9,
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: 1,
          position: 'relative'
        }}
      >{herosPos.map((item, index) => {
        const img = PICTURE_HERO_BASE_URL + item?.icon

        const heroPosition = getHeroPosition(item.lane, index)
        return <Image
          key={item.icon}
          source={{ uri: img }}
          style={[{
            position: 'absolute',
            zIndex: 999,
            aspectRatio: 1,
            width: width * 0.1,
          }, heroPosition]}
        />
      })}
        <Image
          source={MapImage}
          style={{
            width: width * 0.9,
            height: width * 0.9, borderRadius: 15, position: 'absolute'
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export const MapRoleComponent = React.memo(MapRole);
MapRoleComponent.displayName = "MapRoleComponent";
