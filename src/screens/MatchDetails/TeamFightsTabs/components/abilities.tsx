import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import {
  HeroAbilitiesDescriptionsModel,
  ModalRef,
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "../../../../../src/services/props";
import { ITEM_IMAGE_BASE_URL } from "../../../../../src/constants/player";
import EmptyImage from "../../../../images/emptyImage.png";
import { createStyles } from "../styles";
import { TeamSide } from "../../../../../src/services/enum";
import { useRef, useState } from "react";
import { ModalAbilityDetails } from "../../../../../src/components/Modals/ModalAbilityDetails";
import { modalAbilitiesDetails } from "../../../../../src/utils/matchDetailsUtils";

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
  const [abilityIndex, setAbilityIndex] =
    useState<HeroAbilitiesDescriptionsModel>();

  const modalRef = useRef<ModalRef>(null);

  const handleAbilitiesDetails = (abilityName: string) => {
    const { abilityIndex, modalAbilityDetails } =
      modalAbilitiesDetails(abilityName);

    if (abilityIndex.dname) {
      setAbilityIndex(abilityIndex);
      if (modalAbilityDetails) modalRef.current?.open();
    }
  };

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
                        <TouchableOpacity
                          onPress={() => handleAbilitiesDetails(abilityName)}
                        >
                          <Image
                            source={{ uri: abilityImage }}
                            style={styles.itemImage}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                )}
              </View>
            );
          })}
      </View>

      <ModalAbilityDetails ref={modalRef} ability={abilityIndex} />
    </>
  );
};
