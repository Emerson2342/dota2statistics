import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import {
  HeroAbilitiesDescriptionsModel,
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "../../../../../src/services/props";
import { ITEM_IMAGE_BASE_URL } from "../../../../../src/constants/player";
import EmptyImage from "../../../../images/emptyImage.png";
import { createStyles } from "../styles";
import { TeamSide } from "../../../../../src/services/enum";
import { useState } from "react";
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
  const [modalAbilityDetails, setModalAbilityDetails] = useState(false);
  const [abilityIndex, setAbilityIndex] =
    useState<HeroAbilitiesDescriptionsModel>();

  const handleAbilitiesDetails = (abilityName: string) => {
    const { abilityIndex, modalAbilityDetails } =
      modalAbilitiesDetails(abilityName);

    if (abilityIndex) {
      setAbilityIndex(abilityIndex);
      setModalAbilityDetails(modalAbilityDetails);
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
      <Modal
        visible={modalAbilityDetails}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalAbilityDetails(false)}
      >
        <ModalAbilityDetails
          ability={abilityIndex}
          handleClose={() => setModalAbilityDetails(false)}
        />
      </Modal>
    </>
  );
};
