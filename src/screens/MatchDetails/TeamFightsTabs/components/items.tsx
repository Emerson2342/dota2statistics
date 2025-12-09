import { View, Image, TouchableOpacity } from "react-native";
import {
  ModalItemData,
  ModalRef,
  PlayerTeamFight,
  TeamFightModel,
  ThemeColor,
} from "@src/services/props";
import { createStyles } from "../styles";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import EmptyImage from "@src/images/emptyImage.png";
import { TeamSide } from "@src/services/enum";
import ItemsList from "@src/components/Itens/itemsList.json";
import { useRef, useState } from "react";
import { handleItemDetails } from "@src/utils/HandleItemDetails";
import { ModalItemDetails } from "@src/components/Modals/ModalItemDetails";
import { TextComponent } from "@src/components/TextComponent";

type ItemsUsageProps = {
  label: string;
  color: ThemeColor;
  fight: TeamFightModel;
  team: TeamSide;
};

export const ItemsUsages = ({ label, color, fight, team }: ItemsUsageProps) => {
  const styles = createStyles(color);
  const [start, end] = team === TeamSide.Radiant ? [0, 5] : [5, 10];
  const [modalData, setModalData] = useState<ModalItemData | null>(null);
  const modalRef = useRef<ModalRef>(null);

  const getItemDetails = (itemName: string) => {
    const item = ItemsList.find((item) => item.name == itemName);
    if (item) {
      handleItemDetails(0, item, false, setModalData, modalRef);
    }
  };

  return (
    <>
      <TextComponent weight="bold" style={styles.textLabel}>
        {label}
      </TextComponent>
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
                      <TouchableOpacity
                        onPress={() => getItemDetails(itemName)}
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
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            );
          })}
      </View>
      <ModalItemDetails ref={modalRef} data={modalData} />
    </>
  );
};
