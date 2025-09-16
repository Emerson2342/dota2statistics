import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { createStyles } from "./styles";

import AbilitiesDetailsJson from "./../../components/Heroes/AbilitiesDetails.json";
import AbilitiesDescriptionsJson from "./../../components/Heroes/AbilitiesDescriptions.json";
import ItemsList from "./../../components/Itens/itemsList.json";
import AghanimAndShardJson from "./../../components/Heroes/aghanimDescription.json";
import {
  AghanimModel,
  HeroAbilitiesDescriptionsJson,
  HeroAbilitiesDescriptionsModel,
  HeroAbilitiesDetailsJson,
  HeroAbilitiesDetailsModel,
  ItemDetails,
  ItemPopularity,
  ItemPopularityData,
  ModalItemData,
  ModalRef,
} from "./../../services/props";
import { useSettingsContext } from "./../../context/useSettingsContext";
import { useTheme } from "./../../context/useThemeContext";

import { Feather } from "@expo/vector-icons";

import { getHeroItems } from "./../../services/api";
import { ModalItemDetails } from "./../../components/Modals/ModalItemDetails";
import {
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "./../../constants/player";
import useHeroDetails from "../../hooks/useHeroDetails";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { handleItemDetails } from "../../../src/utils/HandleItemDetails";
import { coolDownTime, manaCoust } from "../../../src/utils/HeroDetailsUtils";
import { Header } from "./header";

const imgWidth = Dimensions.get("screen").width * 0.075;

export default function HeroDetailsScreen({ heroId }: { heroId: string }) {
  const { englishLanguage } = useSettingsContext();

  const { ColorTheme } = useTheme();
  const heroDetails = useHeroDetails(Number(heroId));

  const [abilities, setAbilities] = useState<HeroAbilitiesDetailsModel>();
  const [abilitiesDesc, setAbilitiesDesc] = useState<
    HeroAbilitiesDescriptionsModel[] | []
  >([]);
  const [modalItemData, setModalItemData] = useState<ModalItemData | null>(
    null
  );
  const modalItemRef = useRef<ModalRef>(null);
  const [heroItems, setHeroItems] = useState<ItemPopularityData>();

  const [loadingHeroDetails, setLoadingHeroDetails] = useState(true);

  const [loadingItems, setLoadingItems] = useState(true);

  const aaghanimDescription = AghanimAndShardJson as AghanimModel[];

  const styles = createStyles(ColorTheme);

  useEffect(() => {
    if (heroDetails.id === 0) return;
    setTimeout(() => {
      if (heroDetails) {
        setAbilities(heroAbilities[heroDetails.name]);
        HandleGetHeroItems();
      }
      setLoadingHeroDetails(false);
    }, 1759);
  }, [heroDetails]);

  useEffect(() => {
    if (heroDetails.id === 0) return;
    HandleGetAbilities();
  }, [abilities]);

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

  const HandleGetHeroItems = async () => {
    setLoadingItems(true);
    const heroItems = await getHeroItems(heroDetails.id.toString());

    const getTopItems = (items: ItemPopularity): ItemPopularity => {
      return Object.entries(items)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [itemId, count]) => {
          acc[itemId] = count;
          return acc;
        }, {} as ItemPopularity);
    };

    if (heroItems) {
      const topHeroItems: ItemPopularityData = {
        start_game_items: getTopItems(heroItems.start_game_items),
        early_game_items: getTopItems(heroItems.early_game_items),
        mid_game_items: getTopItems(heroItems.mid_game_items),
        late_game_items: getTopItems(heroItems.late_game_items),
      };
      setHeroItems(topHeroItems);
    }
    setLoadingItems(false);
  };

  //const LoreJson: HeroLore = HeroLoreJson;
  const heroAbilities: HeroAbilitiesDetailsJson = AbilitiesDetailsJson;
  const itemsList: ItemDetails[] = ItemsList;

  const ItemHero = ({
    imgUrl,
    itemDetails,
  }: {
    imgUrl: string | undefined;
    itemDetails: ItemDetails | undefined;
  }) => {
    return (
      <TouchableOpacity
        style={{ margin: 1 }}
        onPress={() =>
          handleItemDetails(
            heroDetails.id,
            itemDetails,
            false,
            setModalItemData,
            modalItemRef
          )
        }
      >
        <Image
          width={imgWidth}
          height={imgWidth}
          style={{ borderRadius: 15 }}
          source={{ uri: PICTURE_HERO_BASE_URL + imgUrl }}
        />
      </TouchableOpacity>
    );
  };

  const renderAbilitiesDescriptions = ({
    item,
    index,
  }: {
    item: HeroAbilitiesDescriptionsModel;
    index: number;
  }) => {
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
                <Text style={{ color: "#333" }}>Damage Type:</Text>{" "}
                {item?.dmg_type}
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
            fontStyle: "italic",
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

  if (loadingHeroDetails)
    return (
      <ActivityIndicatorCustom
        message={
          englishLanguage
            ? "Loading Hero Details..."
            : "Carregando Detalhes do Herói..."
        }
      />
    );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header heroId={Number(heroId)} />
        <ScrollView>
          {loadingItems ? (
            <View style={styles.itemsContainer}>
              <Text style={styles.titleText}>
                {englishLanguage ? "Popular Items" : "Itens Populares"}
              </Text>
              <ActivityIndicator size={30} color={ColorTheme.semidark} />
            </View>
          ) : (
            <View style={styles.itemsContainer}>
              <Text style={styles.titleText}>
                {englishLanguage ? "Popular Items" : "Itens Populares"}
              </Text>
              <Text style={styles.textItem}>
                {englishLanguage ? "Start Game" : "Itens Iniciais"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {heroItems && heroItems.start_game_items
                  ? Object.entries(heroItems.start_game_items).map(
                      ([itemId, count]) => {
                        const item = itemsList.find(
                          (i) => i.id.toString() === itemId
                        );
                        return (
                          <ItemHero
                            key={itemId}
                            imgUrl={item?.img}
                            itemDetails={item}
                          />
                        );
                      }
                    )
                  : null}
              </View>
              <Text style={styles.textItem}>
                {englishLanguage ? "Early Game" : "Início Jogo"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {heroItems && heroItems.early_game_items
                  ? Object.entries(heroItems.early_game_items).map(
                      ([itemId, count]) => {
                        const item = itemsList.find(
                          (i) => i.id.toString() === itemId
                        );
                        return (
                          <ItemHero
                            key={itemId}
                            imgUrl={item?.img}
                            itemDetails={item}
                          />
                        );
                      }
                    )
                  : null}
              </View>
              <Text style={styles.textItem}>
                {englishLanguage ? "Mid Game" : "Meio do Jogo"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {heroItems && heroItems.mid_game_items
                  ? Object.entries(heroItems.mid_game_items).map(
                      ([itemId, count]) => {
                        const item = itemsList.find(
                          (i) => i.id.toString() === itemId
                        );
                        return (
                          <ItemHero
                            key={itemId}
                            imgUrl={item?.img}
                            itemDetails={item}
                          />
                        );
                      }
                    )
                  : null}
              </View>
              <Text style={styles.textItem}>
                {englishLanguage ? "Late Game" : "Final do Jogo"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {heroItems && heroItems.late_game_items
                  ? Object.entries(heroItems.late_game_items).map(
                      ([itemId, count]) => {
                        const item = itemsList.find(
                          (i) => i.id.toString() === itemId
                        );
                        return (
                          <ItemHero
                            key={itemId}
                            imgUrl={item?.img}
                            itemDetails={item}
                          />
                        );
                      }
                    )
                  : null}
              </View>
            </View>
          )}
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
                if (facets.deprecated) return;
                return (
                  <View
                    key={index}
                    style={{
                      width: "100%",
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
        <ModalItemDetails ref={modalItemRef} data={modalItemData} />
      </View>
    </View>
  );
}
