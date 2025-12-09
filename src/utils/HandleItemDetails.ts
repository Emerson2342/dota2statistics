import { SetStateAction } from "react";
import {
  AghanimModel,
  ItemDetails,
  ModalItemData,
  ModalRef,
} from "../../src/services/props";
import AghanimDescription from "../components/Heroes/aghanimDescription.json";

const aghaninAndShardDesc = Object.values(AghanimDescription) as AghanimModel[];
export const handleItemDetails = (
  heroId: number,
  item: ItemDetails | undefined,
  isShard: boolean,
  setModalItemData: React.Dispatch<SetStateAction<ModalItemData | null>>,
  modalItemRef: React.RefObject<ModalRef | null>
) => {
  setModalItemData(null);
  let modalData: ModalItemData | null = null;

  if (!item) return;
  if (item?.name === "ultimate_scepter") {
    const scepter = aghaninAndShardDesc.find((s) => s.hero_id === heroId);

    if (scepter) {
      modalData = {
        aghanim: scepter,
        type: "Aghanim's Scepter",
      };
    }
  } else if (item?.name === "aghanims_shard") {
    const shard = aghaninAndShardDesc.find((s) => s.hero_id === heroId);
    //alert(JSON.stringify(shard, null, 2));
    if (shard) {
      modalData = {
        shard: shard,
        type: "Aghanim's Shard",
      };
    }
  } else if (isShard) {
    const shardDesc = aghaninAndShardDesc.find((s) => s.hero_id === heroId);
    if (shardDesc) {
      modalData = {
        shard: shardDesc,
        type: "Aghanim's Shard",
      };
    }
  } else {
    modalData = { item, type: "item" };
  }

  if (modalData) {
    setModalItemData(modalData);
    //alert(JSON.stringify(modalData, null, 2));
    modalItemRef.current?.open();
  }
};
