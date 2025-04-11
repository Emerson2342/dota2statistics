import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { AghanimModel, HeroAbilitiesDescriptionsModel, ItemDetails } from "../../../src/services/props";
import { PICTURE_ITEM_BASE_URL } from "../../../src/constants/player";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
import AbilitiesDescriptions from "../../../src/components/Heroes/AbilitiesDescriptions.json";

export function ModalItemDetails({
  item,
  shard,
  handleClose,
}: {
  item: ItemDetails | undefined;
  shard: AghanimModel | undefined;
  handleClose: () => void;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();


  const aghaninAndShardDesc = useMemo(() => {
    const shardList = Object.values(AbilitiesDescriptions) as HeroAbilitiesDescriptionsModel[];
    return shardList.find((s) => s.dname === shard?.shard_skill_name);
  }, []);

  const itemToShow = {
    itemDname: item?.dname ?? "Shard",
    itemImage: item?.img ?? aghaninAndShardDesc?.img,
    itemDesc: "",
  };



  return (
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
          <Image
            style={[styles.imgItem, { aspectRatio: shard ? 1 : 1.5 }]}
            source={{
              uri: PICTURE_ITEM_BASE_URL + itemToShow.itemImage,
            }}
          />
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
          {shard ? (
            <View>
              <Text style={styles.textTitleDesc}>{aghaninAndShardDesc?.dname}</Text>
              <Text style={styles.textDescription}>
                {"     "}
                {shard?.shard_desc}
              </Text>
            </View>
          ) : null}
          <Text
            style={[styles.textLore, { display: item?.lore ? "flex" : "none" }]}
          >
            "{item?.lore}"
          </Text>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              { backgroundColor: ColorTheme.semidark },
            ]}
            onPress={() => handleClose()}
          >
            <Text style={styles.textButton}>
              {englishLanguage ? "Close" : "Fechar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
