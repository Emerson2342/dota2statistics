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
  AGHANIMSHARD_URL,
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
  PICTURE_ITEM_BASE_URL,
} from "../../constants/player";
import { createStyles } from "./styles";
import int from "../../images/int.png";
import agi from "../../images/agi.png";
import str from "../../images/str.png";
import all from "../../images/all.png";
import boots from "../../images/boots.png";

import itemsList from "../../components/Itens/itemsList.json";
import HeroLoreJson from "../../constants/Lore.json";
import AbilitiesDetailsJson from "../../components/Heroes/AbilitiesDetails.json";
import AbilitiesDescriptionsJson from "../../components/Heroes/AbilitiesDescriptions.json";

import AghanimAndShardJson from "../../components/Heroes/aghanimDescription.json";
import {
  AghanimModel,
  HeroAbilitiesDescriptionsJson,
  HeroAbilitiesDescriptionsModel,
  HeroAbilitiesDetailsJson,
  HeroAbilitiesDetailsModel,
  HeroBenchmarksResult,
  HeroDetailsProps,
  HeroItemsListPopularity,
  HeroLore,
  Item,
  ItemPopularityData,
} from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { getItemsByHero } from "../../API";
import { ModaHeroLore } from "../../components/Modals/ModalHeroLore";
import { BannerAds } from "../../../src/components/BannerAds";
import { FlatList } from "react-native-gesture-handler";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AsyncStorageService } from "../../../src/services/StorageService";
import { useHeroItemListContext } from "../../../src/context/useHeroItemsListContext";
import { MD3Colors, ProgressBar } from "react-native-paper";

export function HeroDetailsScreen({ route }: HeroDetailsProps) {
  const { heroDetails } = route.params;

  const { englishLanguage } = useSettingsContext();

  const { heroItemsList, setHeroItemsList } = useHeroItemListContext();

  const [itemData, setItemData] = useState<ItemPopularityData>();
  useState<HeroBenchmarksResult>();
  const items = itemsList as Item[];
  const { ColorTheme } = useTheme();
  const [heroLore, setHeroLore] = useState<string | undefined>(undefined);
  const [modalHeroLore, setModalHeroLore] = useState(false);
  const [abilities, setAbilities] = useState<HeroAbilitiesDetailsModel>();
  const [abilitiesDesc, setAbilitiesDesc] = useState<
    HeroAbilitiesDescriptionsModel[] | []
  >([]);

  const storageAsync = new AsyncStorageService();

  const aaghanimDescription = AghanimAndShardJson as AghanimModel[];

  const aghanimHeroSelected = aaghanimDescription.find(
    (h) => h.hero_id === heroDetails.id
  );

  const heroItemIndex = heroItemsList.find((h) => h.id === heroDetails.id);
  const styles = createStyles(ColorTheme);

  const HandleGetAbilities = () => {
    const heroAbilitiesDescriptions: HeroAbilitiesDescriptionsJson =
      AbilitiesDescriptionsJson;
    const abilitiesResult =
      abilities?.abilities &&
      abilities?.abilities?.map((a) => heroAbilitiesDescriptions[a]);
    setAbilitiesDesc(abilitiesResult ?? []);
  };

  useEffect(() => {
    console.log(`Herói Selecionado: ${heroDetails.localized_name}`);

    const LoreJson: HeroLore = HeroLoreJson;
    setHeroLore(LoreJson[heroDetails.name]);
    const heroAbilities: HeroAbilitiesDetailsJson = AbilitiesDetailsJson;
    setAbilities(heroAbilities[heroDetails.name]);

    const fetchItems = async () => {
      if (!heroItemIndex) {
        console.log("Entrou no endpoint items");
        const responseDataItems = await getItemsByHero(heroDetails.id);
        if (responseDataItems) {
          setItemData(responseDataItems);
          const newHeroItems: HeroItemsListPopularity = {
            id: heroDetails.id,
            item: responseDataItems,
          };
          setHeroItemsList((prevList) => [...prevList, newHeroItems]);
        }
      } else {
        setTimeout(() => {
          setItemData(heroItemIndex.item);
          console.log("Não entrou no endpoint items");
        }, 200);
      }
    };

    const loadData = async () => {
      try {
        const storedHeroItemsList = await storageAsync.getItem<
          HeroItemsListPopularity[]
        >("heroItemsList");
        if (storedHeroItemsList) setHeroItemsList(storedHeroItemsList);
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      }
    };

    loadData();

    fetchItems();
  }, []);

  useEffect(() => {
    HandleGetAbilities();
  }, [abilities]);

  const getItemImage = (itemId: string): string | null => {
    const item = items.find((i) => i.id === parseInt(itemId));
    return item ? `${PICTURE_ITEM_BASE_URL}${item.img}` : null;
  };
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
  //replace for loading useEffect
  // if (!itemData) {
  //   return (
  //     <View style={styles.activeIndicator}>
  //       <ActivityIndicator color={ColorTheme.semidark} size={"large"} />
  //       <Text style={{ fontFamily: "QuickSand-Semibold" }}>
  //         {englishLanguage
  //           ? "Loading hero details..."
  //           : "Carregando detalhes do herói..."}
  //       </Text>
  //     </View>
  //   );
  // }

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
      <View style={styles.ablitityContainer} key={index}>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalHeroLore(true)}
        style={styles.headerContainer}
      >
        <Text style={styles.nameText}>{heroDetails.localized_name}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Image style={{ width: 15, height: 15 }} source={attImage} />

          <Text style={[styles.textAtributo, { color: "#bbb", fontSize: 13 }]}>
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
                <Text style={styles.shadowText}>{Math.round(baseHelth)}</Text>
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
                <Text style={styles.shadowText}>{Math.round(baseMana)}</Text>
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
                <Text style={styles.attGain}> + {heroDetails.str_gain}</Text>
              </View>
              <View style={styles.attContainer}>
                <Image style={{ width: 19, height: 19 }} source={agi} />
                <Text style={styles.attNumber}>{heroDetails.base_agi}</Text>
                <Text style={styles.attGain}> + {heroDetails.agi_gain}</Text>
              </View>
              <View style={styles.attContainer}>
                <Image style={{ width: 19, height: 19 }} source={int} />
                <Text style={styles.attNumber}>{heroDetails.base_int}</Text>
                <Text style={styles.attGain}> + {heroDetails.int_gain}</Text>
              </View>
            </View>
            <View style={{ width: "65%", alignItems: "center" }}>
              <Text style={styles.textAtributo}>{heroDetails.attack_type}</Text>
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
      </TouchableOpacity>
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
              scrollEnabled={false}
            />
          </View>
          {/* Aghanim e Shard */}
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
          <View
            style={[
              styles.facetsContainer,
              { display: aghanimHeroSelected?.has_shard ? "flex" : "none" },
            ]}
          >
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

          {/* Facetas */}
          <View style={styles.facetsContainer}>
            <Text style={styles.titleText}>
              {englishLanguage ? "Facets" : "Facetas"}
            </Text>

            {abilities?.facets.map((facets, index) => {
              console.log("Faceta " + facets.name);
              return (
                <View
                  key={index}
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.textTitle2} key={index}>
                    {facets.title}
                  </Text>
                  <Text style={styles.textDescription}>
                    {"      " + facets.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <Text
            style={styles.titleText}
            onLongPress={() => alert(heroItemsList.length)}
          >
            {englishLanguage ? "Popular Items" : "Itens Populares"}
          </Text>
          {itemData ? (
            <View style={{ width: "100%" }}>
              <Text style={styles.textItems}>Start Game</Text>
              <View style={[styles.itemContainer]}>
                {Object.keys(itemData.start_game_items)
                  .map((itemId) => getItemImage(itemId))
                  .filter((uri) => uri !== null)
                  .map((uri, index) => (
                    <Image
                      key={index}
                      style={[styles.itemImg]}
                      source={{ uri }}
                    />
                  ))}
              </View>
              <Text style={styles.textItems}>Early Game</Text>
              <View style={styles.itemContainer}>
                {Object.keys(itemData.early_game_items)
                  .map((itemId) => getItemImage(itemId))
                  .filter((uri) => uri !== null)
                  .map((uri, index) => (
                    <Image
                      key={index}
                      style={[styles.itemImg]}
                      source={{ uri }}
                    />
                  ))}
              </View>
              <Text style={styles.textItems}>Mid Game</Text>
              <View style={styles.itemContainer}>
                {Object.keys(itemData.mid_game_items)
                  .map((itemId) => getItemImage(itemId))
                  .filter((uri) => uri !== null)
                  .map((uri, index) => (
                    <Image
                      key={index}
                      style={[styles.itemImg]}
                      source={{ uri }}
                    />
                  ))}
              </View>
              <Text style={styles.textItems}>Late Game</Text>
              <View style={styles.itemContainer}>
                {Object.keys(itemData.late_game_items)
                  .map((itemId) => getItemImage(itemId))
                  .filter((uri) => uri !== null)
                  .map((uri, index) => (
                    <Image
                      key={index}
                      style={[styles.itemImg]}
                      source={{ uri }}
                    />
                  ))}
              </View>
            </View>
          ) : (
            <ActivityIndicator color={ColorTheme.semidark} />
          )}
        </View>
      </ScrollView>
      <BannerAds />
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
          handleClose={() => setModalHeroLore(false)}
          localizedName={heroDetails.localized_name}
          loreText={heroLore}
        />
      </Modal>
    </View>
  );
}
