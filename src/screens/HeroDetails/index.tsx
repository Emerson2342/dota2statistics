import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "../../constants/player";
import { createStyles } from "./styles";
import int from "../../images/int.png";
import agi from "../../images/agi.png";
import str from "../../images/str.png";
import all from "../../images/all.png";
import boots from "../../images/boots.png";

import HeroLoreJson from "../../constants/Lore.json";
import HeroLorePtBrJson from "../../constants/LorePtBr.json";
import AbilitiesDetailsJson from "../../components/Heroes/AbilitiesDetails.json";
import AbilitiesDescriptionsJson from "../../components/Heroes/AbilitiesDescriptions.json";

import AghanimAndShardJson from "../../components/Heroes/aghanimDescription.json";
import {
  AghanimModel,
  HeroAbilitiesDescriptionsJson,
  HeroAbilitiesDescriptionsModel,
  HeroAbilitiesDetailsJson,
  HeroAbilitiesDetailsModel,
  HeroDetailsProps,
  HeroLore,
} from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { ModaHeroLore } from "../../components/Modals/ModalHeroLore";
import { BannerAds } from "../../components/Admob/BannerAds";
import { FlatList } from "react-native-gesture-handler";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function HeroDetailsScreen({ route }: HeroDetailsProps) {
  const { heroDetails } = route.params;

  const { englishLanguage } = useSettingsContext();

  const { ColorTheme } = useTheme();
  const [heroLore, setHeroLore] = useState<string | undefined>(undefined);
  const [modalHeroLore, setModalHeroLore] = useState(false);
  const [abilities, setAbilities] = useState<HeroAbilitiesDetailsModel>();
  const [abilitiesDesc, setAbilitiesDesc] = useState<
    HeroAbilitiesDescriptionsModel[] | []
  >([]);

  const [loadingAbilit, setLoadingAbilit] = useState(true);
  const [loreJson, setLoreJson] = useState<HeroLore>(HeroLoreJson);

  const aaghanimDescription = AghanimAndShardJson as AghanimModel[];

  const styles = createStyles(ColorTheme);

  const HandleGetAbilities = () => {
    const heroAbilitiesDescriptions: HeroAbilitiesDescriptionsJson =
      AbilitiesDescriptionsJson;
    const abilitiesResult =
      abilities?.abilities &&
      abilities?.abilities?.map((a) => heroAbilitiesDescriptions[a]);
    setAbilitiesDesc(abilitiesResult ?? []);
  };
  const aghanimHeroSelected = aaghanimDescription.find(
    (h) => h.hero_id === heroDetails.id
  );

  //const LoreJson: HeroLore = HeroLoreJson;
  const heroAbilities: HeroAbilitiesDetailsJson = AbilitiesDetailsJson;
  useEffect(() => {
    console.log(`Herói Selecionado: ${heroDetails.localized_name}`);
    setTimeout(() => {
      setAbilities(heroAbilities[heroDetails.name]);
      setLoadingAbilit(false);
    }, 1759);
  }, []);

  useEffect(() => {
    HandleGetAbilities();
    setLoreJson(englishLanguage ? HeroLoreJson : HeroLorePtBrJson);
    setHeroLore(loreJson[heroDetails.name]);
  }, [abilities]);

  let fontImage = PICTURE_HERO_BASE_URL + heroDetails.img;

  let atributo = "";
  let attImage = null;
  let baseAttack = 0;

  switch (heroDetails.primary_attr) {
    case "all":
      {
        atributo = "Universal";
        attImage = all;
        baseAttack =
          (heroDetails.base_str + heroDetails.base_agi + heroDetails.base_int) *
          0.7;
      }
      break;
    case "str":
      {
        atributo = englishLanguage ? "Strength" : "Força";
        attImage = str;
        baseAttack = heroDetails.base_str;
      }
      break;
    case "agi":
      {
        atributo = englishLanguage ? "Agility" : "Agilidade";
        attImage = agi;
        baseAttack = heroDetails.base_agi;
      }
      break;
    case "int":
      {
        atributo = englishLanguage ? "Intelligence" : "Inteligência";
        attImage = int;
        baseAttack = heroDetails.base_int;
      }
      break;
  }
  const baseAttMin = heroDetails.base_attack_min + baseAttack;
  const baseAttMax = heroDetails.base_attack_max + baseAttack;
  const baseHelth = 120 + heroDetails.base_str * 22;
  const baseMana = 75 + heroDetails.base_int * 12;
  const helthRegen = heroDetails.base_health_regen + heroDetails.base_str * 0.1;
  const manaRegen =
    heroDetails.base_mana_regen +
    heroDetails.base_int * 0.05 * (1 + heroDetails.base_int * 0.02);

  const renderAbilitiesDescriptions = ({
    item,
    index,
  }: {
    item: HeroAbilitiesDescriptionsModel;
    index: number;
  }) => {
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

    const mana = manaCoust(item?.mc);
    const coolDown = coolDownTime(item?.cd);

    return (
      <View
        style={[
          styles.ablitityContainer,
          {
            borderTopWidth: index == 0 ? 0 : 1,
            borderColor: "#ccc",
            display: item?.desc && item.dname ? "flex" : "none",
          },
        ]}
        key={index}
      >
        <Text style={styles.titleAbility}>{item?.dname}</Text>
        <View style={styles.abilityContent}>
          <View style={styles.content1}>
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Image
                  src={`${PICTURE_HERO_BASE_URL}${item?.img}`}
                  style={styles.abilityImg}
                />
                <View style={{ paddingLeft: "3%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: item?.cd ? "flex" : "none",
                    }}
                  >
                    <Feather name="clock" color={"#555"} />
                    <Text> {coolDown}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: item?.mc ? "flex" : "none",
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
              </View>
              <Text
                style={{
                  display: item?.bkbpierce ? "flex" : "none",
                  fontFamily: "QuickSand-Semibold",
                  color: "#888",
                }}
              >
                <Text style={{ color: "#333" }}>Pierce bkb:</Text>{" "}
                {item?.bkbpierce}
              </Text>
            </View>
          </View>

          <View style={styles.content2}>
            <View style={{}}>
              <Text
                style={{
                  display: item?.dispellable ? "flex" : "none",
                  fontFamily: "QuickSand-Semibold",
                  color: "#888",
                }}
              >
                <Text style={{ color: "#333" }}>Dispellable:</Text>{" "}
                {item?.dispellable}
              </Text>
              <Text
                style={{
                  display: item?.dmg_type ? "flex" : "none",
                  fontFamily: "QuickSand-Semibold",
                  color: "#888",
                }}
              >
                <Text style={{ color: "#333" }}>Damage:</Text> {item?.dmg_type}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.textDescription}>
          {"     "}
          {item?.desc}
        </Text>
        <Text
          style={{
            display: item?.lore ? "flex" : "none",
            fontFamily: "QuickSand-Semibold",
            color: "#aaa",
            marginTop: 9,
            textAlign: "center",
          }}
        >
          "{item?.lore}"
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loadingAbilit ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ColorTheme.light,
          }}
        >
          <View style={{ flex: 0.9, justifyContent: "center" }}>
            <ActivityIndicator size={30} color={ColorTheme.semidark} />
            <Text
              style={{
                fontFamily: "QuickSand-Semibold",
                color: ColorTheme.dark,
              }}
            >
              {englishLanguage
                ? "Loading hero details..."
                : "Carregando detalhes do herói..."}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => setModalHeroLore(true)}>
              <Ionicons
                name="information-circle"
                color={"#fff"}
                style={{ position: "absolute", margin: 5, right: 3 }}
                size={27}
              />
            </TouchableOpacity>
            <Text style={styles.nameText}>{heroDetails.localized_name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Image style={{ width: 15, height: 15 }} source={attImage} />

              <Text
                style={[styles.textAtributo, { color: "#bbb", fontSize: 13 }]}
              >
                {" "}
                {atributo}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: fontImage,
                  }}
                  onError={(error) =>
                    console.error("Erro ao carregar a imgae: ", error)
                  }
                />
                <LinearGradient
                  colors={["#2a6623", "#79ee3c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.shadowText}>
                      {Math.round(baseHelth)}
                    </Text>
                    <Text style={styles.textHelth}>{baseHelth}</Text>
                  </View>
                </LinearGradient>

                <LinearGradient
                  colors={["#125adc", "#71f3fd"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: "100%",
                    alignItems: "center",
                    borderBottomRightRadius: 7,
                    borderBottomLeftRadius: 7,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.shadowText}>
                      {Math.round(baseMana)}
                    </Text>
                    <Text style={styles.textHelth}>{Math.round(baseMana)}</Text>
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.atributos}>
                <View
                  style={{
                    justifyContent: "space-around",
                    width: "30%",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.attContainer}>
                    <Image style={{ width: 19, height: 19 }} source={str} />
                    <Text style={styles.attNumber}>{heroDetails.base_str}</Text>
                    <Text style={styles.attGain}>
                      {" "}
                      + {heroDetails.str_gain}
                    </Text>
                  </View>
                  <View style={styles.attContainer}>
                    <Image style={{ width: 19, height: 19 }} source={agi} />
                    <Text style={styles.attNumber}>{heroDetails.base_agi}</Text>
                    <Text style={styles.attGain}>
                      {" "}
                      + {heroDetails.agi_gain}
                    </Text>
                  </View>
                  <View style={styles.attContainer}>
                    <Image style={{ width: 19, height: 19 }} source={int} />
                    <Text style={styles.attNumber}>{heroDetails.base_int}</Text>
                    <Text style={styles.attGain}>
                      {" "}
                      + {heroDetails.int_gain}
                    </Text>
                  </View>
                </View>
                <View style={{ width: "65%", alignItems: "center" }}>
                  <Text style={styles.textAtributo}>
                    {heroDetails.attack_type}
                  </Text>
                  <View
                    style={{
                      flexWrap: "wrap",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {heroDetails.roles.map((role, index) => (
                      <Text key={index} style={styles.textName}>
                        {role}
                        {index !== heroDetails.roles.length - 1 ? ", " : ""}
                      </Text>
                    ))}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-around",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="sword"
                        size={17}
                        color={"#ccc"}
                      />
                      <Text
                        style={[styles.attGain, { color: "#fff" }]}
                      >{`${Math.floor(baseAttMin)} - ${Math.floor(
                        baseAttMax
                      )}`}</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image style={{ width: 23, height: 23 }} source={boots} />
                      <Text style={[styles.attGain, { color: "#fff" }]}>
                        {" "}
                        {heroDetails.move_speed}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <ScrollView>
            <View style={styles.itemsContainer}>
              <Text style={styles.titleText}>
                {englishLanguage ? "Abilities" : "Habilidades"}
              </Text>
              {/* Habilidades */}
              <View style={styles.abilitiesContainer}>
                <FlatList
                  data={abilitiesDesc}
                  renderItem={renderAbilitiesDescriptions}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              </View>
              {/* Aghanim e Shard */}
            </View>
            <View style={styles.itemsContainer}>
              <View style={styles.facetsContainer}>
                <Text style={styles.titleText}>
                  {englishLanguage ? "Aghanim's Scepter" : "Cetro de Aghanim"}
                </Text>
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Text style={styles.textTitle2}>
                    {aghanimHeroSelected?.scepter_skill_name}
                  </Text>
                  <Text style={styles.textDescription}>
                    {"      " + aghanimHeroSelected?.scepter_desc}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.itemsContainer,
                { display: aghanimHeroSelected?.has_shard ? "flex" : "none" },
              ]}
            >
              <View style={styles.facetsContainer}>
                <Text style={styles.titleText}>
                  {englishLanguage ? "Aghanim's Shard" : "Aghanim Shard"}
                </Text>
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Text style={styles.textTitle2}>
                    {aghanimHeroSelected?.shard_skill_name}
                  </Text>
                  <Text style={styles.textDescription}>
                    {"      " + aghanimHeroSelected?.shard_desc}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.itemsContainer}>
              {/* Facetas */}
              <View style={styles.facetsContainer}>
                <Text style={styles.titleText}>
                  {englishLanguage ? "Facets" : "Facetas"}
                </Text>

                {abilities?.facets.map((facets, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        width: "100%",
                        // backgroundColor: "purple",
                        borderTopWidth: index == 0 ? 0 : 1,
                        borderColor: "#ccc",
                        //alignItems: "center",
                      }}
                    >
                      <Text style={styles.textTitle2} key={index}>
                        {facets.title}
                      </Text>
                      <Text style={styles.textDescription}>
                        {" " + facets.description}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 7,
                          marginBottom: 7,
                        }}
                      >
                        {facets.abilities &&
                          facets.abilities?.map((abi, index) => {
                            const imgFacet = ITEM_IMAGE_BASE_URL + abi + ".png";
                            return (
                              <Image
                                key={index}
                                width={35}
                                height={35}
                                source={{ uri: imgFacet }}
                                style={{ borderRadius: 7, marginHorizontal: 5 }}
                              />
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View style={{ paddingTop: 3 }}>
            <BannerAds />
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          ></View>
          <Modal
            visible={modalHeroLore}
            transparent={true}
            statusBarTranslucent={true}
            animationType="fade"
          >
            <ModaHeroLore
              urlImage={heroDetails.img}
              handleClose={() => setModalHeroLore(false)}
              localizedName={heroDetails.localized_name}
              loreText={heroLore}
            />
          </Modal>
        </View>
      )}
    </View>
  );
}
