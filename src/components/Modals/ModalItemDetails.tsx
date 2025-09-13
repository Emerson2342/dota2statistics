import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import {
  AghanimModel,
  HeroAbilitiesDescriptionsModel,
  ItemDetails,
  ModalItemData,
  ModalRef,
} from "../../../src/services/props";
import { PICTURE_ITEM_BASE_URL } from "../../../src/constants/player";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
import AbilitiesDescriptions from "../../../src/components/Heroes/AbilitiesDescriptions.json";
import { Feather } from "@expo/vector-icons";
import { coolDownTime, manaCoust } from "../../../src/utils/HeroDetailsUtils";

type Props = {
  data: ModalItemData | null;
  handleClose: () => void;
};

export const ModalItemDetails = forwardRef<ModalRef, Props>(
  ({ data, handleClose }, ref) => {
    const [visible, setVisible] = useState(false);
    const { englishLanguage } = useSettingsContext();
    const { ColorTheme } = useTheme();

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
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000AA",
          }}
        >
          <BannerAds />
          <View style={styles.modal}>
            <View style={styles.container}>
              <Text style={styles.textTitle}>{itemToShow.itemDname}</Text>
              <View
                style={{
                  flexDirection: "row",
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
                      <Text> {coolDown}</Text>
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
                      <Text> {mana}</Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      display: aghaninAndShardDesc?.bkbpierce ? "flex" : "none",
                      fontFamily: "QuickSand-Semibold",
                      color: "#888",
                    }}
                  >
                    <Text style={{ color: "#333" }}>Pierce bkb:</Text>{" "}
                    {aghaninAndShardDesc?.bkbpierce}
                  </Text>
                  <Text
                    style={{
                      display: aghaninAndShardDesc?.dmg_type ? "flex" : "none",
                      fontFamily: "QuickSand-Semibold",
                      color: "#888",
                    }}
                  >
                    <Text style={{ color: "#333" }}>Damage Type:</Text>{" "}
                    {aghaninAndShardDesc?.dmg_type}
                  </Text>
                  <Text
                    style={{
                      display: aghaninAndShardDesc?.dispellable
                        ? "flex"
                        : "none",
                      fontFamily: "QuickSand-Semibold",
                      color: "#888",
                    }}
                  >
                    <Text style={{ color: "#333" }}>Dispellable:</Text>{" "}
                    {aghaninAndShardDesc?.dispellable}
                  </Text>
                </View>
              </View>
              {item?.abilities?.map((item, index) => {
                return (
                  <View key={index}>
                    <Text style={styles.textTitleDesc}>{item.title}</Text>
                    <Text style={styles.textDescription}>
                      {"     "}
                      {item.description}
                    </Text>
                  </View>
                );
              })}
              {shard || aghanim ? (
                <View>
                  <Text style={styles.textTitleDesc}>
                    {aghaninAndShardDesc?.dname}
                  </Text>
                  <Text style={styles.textDescription}>
                    {"     "}
                    {shard?.shard_desc}
                    {aghanim?.scepter_desc}
                  </Text>
                  <Text
                    style={{
                      display: aghaninAndShardDesc?.lore ? "flex" : "none",
                      fontStyle: "italic",
                      color: "#aaa",
                      marginTop: 9,
                      textAlign: "center",
                    }}
                  >
                    "{aghaninAndShardDesc?.lore}"
                  </Text>
                </View>
              ) : null}
              <Text
                style={[
                  styles.textLore,
                  { display: item?.lore ? "flex" : "none" },
                ]}
              >
                "{item?.lore}"
              </Text>
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
                <Text style={styles.textButton}>
                  {englishLanguage ? "Close" : "Fechar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

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
    fontFamily: "QuickSand-Bold",
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
    fontFamily: "QuickSand-Bold",
    textAlign: "center",
    fontSize: Dimensions.get("window").width * 0.04,
    padding: "2%",
  },
  textDescription: {
    fontFamily: "QuickSand-Semibold",
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
    fontFamily: "QuickSand-Bold",
    fontSize: Dimensions.get("window").width * 0.04,
  },
});
