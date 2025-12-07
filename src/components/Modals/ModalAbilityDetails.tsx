import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { HeroAbilitiesDescriptionsModel, ModalRef } from "../../services/props";
import { PICTURE_ITEM_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
import { Feather } from "@expo/vector-icons";
import EmptyImage from "../../images/emptyImage.png";
import { TextComponent } from "../TextComponent";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  ability: HeroAbilitiesDescriptionsModel | undefined;
};

export const ModalAbilityDetails = forwardRef<ModalRef, Props>(
  ({ ability }, ref) => {
    const { englishLanguage } = useSettingsContext();
    const { ColorTheme } = useTheme();

    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible(false);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }));

    const manaCoust = (mc?: string | string[]) => {
      if (Array.isArray(mc)) {
        return mc.join(", ");
      }
      return mc ?? "";
    };

    const coolDownTime = (cd?: string | string[]) => {
      if (Array.isArray(cd)) {
        return cd.join(", ");
      }
      return cd ?? "";
    };

    const mana = manaCoust(ability?.mc);
    const coolDown = coolDownTime(ability?.cd);

    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleClose}
      >
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
                {ability?.dname}
              </TextComponent>
              <View style={{ flexDirection: "row", marginVertical: "3%" }}>
                <Image
                  style={[styles.imgItem, { position: "absolute" }]}
                  source={EmptyImage}
                />
                <Image
                  style={styles.imgItem}
                  source={{
                    uri: PICTURE_ITEM_BASE_URL + ability?.img,
                  }}
                />
                <View style={{ justifyContent: "center", marginLeft: "3%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: ability?.cd ? "flex" : "none",
                      gap: 5,
                    }}
                  >
                    <Feather name="clock" color={"#555"} />
                    <TextComponent weight="semibold" style={styles.textDetails}>
                      {coolDown}
                    </TextComponent>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: ability?.mc ? "flex" : "none",
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
                    <TextComponent weight="semibold" style={styles.textDetails}>
                      {" "}
                      {mana}
                    </TextComponent>
                  </View>
                  <TextComponent
                    weight="semibold"
                    style={[
                      styles.textDetails,
                      { display: ability?.dmg_type ? "flex" : "none" },
                    ]}
                  >
                    Damage Type:{" "}
                    <TextComponent weight="semibold" style={{ color: "#999" }}>
                      {ability?.dmg_type}
                    </TextComponent>
                  </TextComponent>
                  <TextComponent
                    weight="semibold"
                    style={[
                      styles.textDetails,
                      {
                        display: ability?.bkbpierce ? "flex" : "none",
                      },
                    ]}
                  >
                    Pierce BKB:{" "}
                    <TextComponent weight="semibold" style={{ color: "#999" }}>
                      {ability?.bkbpierce}
                    </TextComponent>
                  </TextComponent>
                  <TextComponent
                    weight="semibold"
                    style={[
                      styles.textDetails,
                      {
                        display: ability?.dispellable ? "flex" : "none",
                      },
                    ]}
                  >
                    Dispellable:{" "}
                    <TextComponent weight="semibold" style={{ color: "#999" }}>
                      {ability?.dispellable}
                    </TextComponent>
                  </TextComponent>
                </View>
              </View>
              <TextComponent
                weight="semibold"
                style={[
                  styles.textDescription,
                  { display: ability?.desc ? "flex" : "none" },
                ]}
              >
                {"     "}
                {ability?.desc}
              </TextComponent>

              <TextComponent
                style={[
                  styles.textLore,
                  { display: ability?.lore ? "flex" : "none" },
                ]}
              >
                "{ability?.lore}"
              </TextComponent>

              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  { backgroundColor: ColorTheme.semidark },
                ]}
                onPress={handleClose}
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
    fontSize: Dimensions.get("window").width * 0.05,
    marginBottom: "3%",
  },
  imgItem: {
    width: Dimensions.get("window").width * 0.25,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
  },
  textDetails: {
    fontSize: Dimensions.get("screen").width * 0.033,
  },
  textDescription: {
    textAlign: "justify",
    color: "#333",
    fontSize: Dimensions.get("window").width * 0.03,
  },
  textLore: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    paddingBottom: "3%",
    paddingTop: "3%",
    fontSize: Dimensions.get("window").width * 0.03,
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
