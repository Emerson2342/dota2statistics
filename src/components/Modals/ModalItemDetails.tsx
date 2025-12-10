import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import {
  HeroAbilitiesDescriptionsModel,
  ModalItemData,
  ModalRef,
} from "../../../src/services/props";
import { PICTURE_ITEM_BASE_URL } from "@src/constants/player";
import { useTheme } from "@src/context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
import AbilitiesDescriptions from "@src/components/Heroes/AbilitiesDescriptions.json";
import { Feather } from "@expo/vector-icons";
import { coolDownTime, manaCoust } from "@src/utils/HeroDetailsUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextComponent } from "../TextComponent";
import { useSettingsStore } from "@src/store/settings";

type Props = {
  data: ModalItemData | null;
};

export const ModalItemDetails = forwardRef<ModalRef, Props>(({ data }, ref) => {
  const [visible, setVisible] = useState(false);
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();
  const handleClose = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  if (!data) return null;

  const { item, shard, aghanim, type } = data;

  const shardList = Object.values(
    AbilitiesDescriptions
  ) as HeroAbilitiesDescriptionsModel[];

  const aghaninAndShardDesc = shard
    ? shardList.find((s) => s.dname === shard?.shard_skill_name)
    : aghanim
    ? shardList.find((s) => s.dname === aghanim?.scepter_skill_name)
    : undefined;

  const itemToShow = {
    itemDname: item?.dname ?? type,
    itemImage: item?.img ?? aghaninAndShardDesc?.img,
  };

  const mana = manaCoust(aghaninAndShardDesc?.mc);
  const coolDown = coolDownTime(aghaninAndShardDesc?.cd);
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000000AA",
        }}
      >
        <BannerAds />
        <View style={styles.modal}>
          <View style={styles.container}>
            <TextComponent weight="bold" style={styles.textTitle}>
              {itemToShow.itemDname}
            </TextComponent>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "90%",
              }}
            >
              <Image
                style={[
                  styles.imgItem,
                  { aspectRatio: shard || aghanim ? 1 : 1.5 },
                ]}
                source={{
                  uri: PICTURE_ITEM_BASE_URL + itemToShow.itemImage,
                }}
              />
              <View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: aghaninAndShardDesc?.cd ? "flex" : "none",
                    }}
                  >
                    <Feather name="clock" color={"#555"} />
                    <TextComponent weight="semibold" style={{}}>
                      {" "}
                      {coolDown}
                    </TextComponent>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: aghaninAndShardDesc?.mc ? "flex" : "none",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#2596be",
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                      }}
                    />
                    <TextComponent weight="semibold" style={{}}>
                      {" "}
                      {mana}
                    </TextComponent>
                  </View>
                </View>
                <TextComponent
                  style={{
                    display: aghaninAndShardDesc?.bkbpierce ? "flex" : "none",
                    fontFamily: "QuickSand-Semibold",
                    color: "#888",
                  }}
                >
                  <TextComponent style={{ color: "#333" }}>
                    Pierce bkb:
                  </TextComponent>{" "}
                  {aghaninAndShardDesc?.bkbpierce}
                </TextComponent>
                <TextComponent
                  weight="semibold"
                  style={{
                    display: aghaninAndShardDesc?.dmg_type ? "flex" : "none",
                    fontFamily: "QuickSand-Semibold",
                    color: "#888",
                  }}
                >
                  <TextComponent style={{ color: "#333" }}>
                    Damage Type:
                  </TextComponent>{" "}
                  {aghaninAndShardDesc?.dmg_type}
                </TextComponent>
                <TextComponent
                  style={{
                    display: aghaninAndShardDesc?.dispellable ? "flex" : "none",
                    fontFamily: "QuickSand-Semibold",
                    color: "#888",
                  }}
                >
                  <TextComponent weight="semibold" style={{ color: "#333" }}>
                    Dispellable:
                  </TextComponent>{" "}
                  {aghaninAndShardDesc?.dispellable}
                </TextComponent>
              </View>
            </View>
            {item?.abilities?.map((item, index) => {
              return (
                <View key={index}>
                  <TextComponent weight="bold" style={styles.textTitleDesc}>
                    {item.title}
                  </TextComponent>
                  <TextComponent
                    weight="semibold"
                    style={styles.textDescription}
                  >
                    {"     "}
                    {item.description}
                  </TextComponent>
                </View>
              );
            })}
            {shard || aghanim ? (
              <View>
                <TextComponent style={styles.textTitleDesc}>
                  {aghaninAndShardDesc?.dname}
                </TextComponent>
                <TextComponent style={styles.textDescription}>
                  {"     "}
                  {shard?.shard_desc}
                  {aghanim?.scepter_desc}
                </TextComponent>
                <TextComponent
                  style={{
                    display: aghaninAndShardDesc?.lore ? "flex" : "none",
                    fontStyle: "italic",
                    color: "#aaa",
                    marginTop: 9,
                    textAlign: "center",
                  }}
                >
                  "{aghaninAndShardDesc?.lore}"
                </TextComponent>
              </View>
            ) : null}
            <TextComponent
              style={[
                styles.textLore,
                { display: item?.lore ? "flex" : "none" },
              ]}
            >
              "{item?.lore}"
            </TextComponent>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                { backgroundColor: ColorTheme.semidark },
              ]}
              onPress={() => {
                setVisible(false);
                handleClose;
              }}
            >
              <TextComponent weight="bold" style={styles.textButton}>
                {englishLanguage ? "Close" : "Fechar"}
              </TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: "3%",
  },
  textTitle: {
    fontSize: Dimensions.get("window").width * 0.05,
    marginBottom: "3%",
  },
  imgItem: {
    width: Dimensions.get("window").width * 0.2,
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 10,
    marginRight: 5,
  },
  textTitleDesc: {
    textAlign: "center",
    fontSize: Dimensions.get("window").width * 0.04,
    padding: "2%",
  },
  textDescription: {
    textAlign: "justify",
    color: "#333",
    fontSize: Dimensions.get("window").width * 0.035,
  },
  textLore: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    paddingBottom: "3%",
    paddingTop: "3%",
  },
  buttonContainer: {
    marginTop: "5%",
    padding: "2%",
    margin: "2%",
    borderRadius: 10,
    width: "50%",
  },
  textButton: {
    color: "#fff",
    textAlign: "center",
    fontSize: Dimensions.get("window").width * 0.04,
  },
});
