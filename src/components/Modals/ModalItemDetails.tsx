import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { ItemDetails } from "../../../src/services/props";
import { PICTURE_ITEM_BASE_URL } from "../../../src/constants/player";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
export function ModalItemDetails({
  item,
  handleClose,
}: {
  item: ItemDetails | undefined;
  handleClose: () => void;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

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
          <Text style={styles.textTitle}>{item?.dname}</Text>
          <Text
            style={[styles.textLore, { display: item?.lore ? "flex" : "none" }]}
          >
            {item?.lore}
          </Text>
          <Image
            style={styles.imgItem}
            source={{
              uri: PICTURE_ITEM_BASE_URL + item?.img,
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
    width: Dimensions.get("window").width * 0.25,
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 10,
  },
  textTitleDesc: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "center",
    fontSize: Dimensions.get("window").width * 0.04,
    padding: "2%",
  },
  textDescription: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "justify",
    color: "#333",
    fontSize: Dimensions.get("window").width * 0.04,
  },
  textLore: {
    fontFamily: "QuickSand-Bold",
    color: "#aaa",
    textAlign: "center",
    paddingBottom: "3%",
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
