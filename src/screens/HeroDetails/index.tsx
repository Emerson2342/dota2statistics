import { ReactNode, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { createStyles } from "./styles";

import AbilitiesDetailsJson from "@src/components/Heroes/AbilitiesDetails.json";
import AbilitiesDescriptionsJson from "@src/components/Heroes/AbilitiesDescriptions.json";
import ItemsList from "@src/components/Itens/itemsList.json";
import AghanimAndShardJson from "@src/components/Heroes/aghanimDescription.json";
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
} from "@src/services/props";

import { Feather } from "@expo/vector-icons";

import { fetchData } from "@src/services/api";
import { ModalItemDetails } from "@src/components/Modals/ModalItemDetails";
import {
  HERO_ITEM_BASE_URL,
  ITEM_IMAGE_BASE_URL,
  PICTURE_HERO_BASE_URL,
} from "@src/constants/player";
import useHeroDetails from "@src/utils/getHeroDetails";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { handleItemDetails } from "@src/utils/HandleItemDetails";
import { coolDownTime, manaCoust } from "@src/utils/HeroDetailsUtils";
import { Header } from "./header";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { LinearGradientComponent } from "@src/components/LinearGradient";

const imgWidth = Dimensions.get("screen").width * 0.075;

type TitleContainerProps = {
  engText: string;
  ptText: string;
};

export default function HeroDetailsScreen({ heroId }: { heroId: string }) {
  const { englishLanguage } = useSettingsStore();

  const colorTheme = useThemeStore((state) => state.colorTheme);

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
  let itemsResponse: ItemPopularityData;

  const styles = createStyles(colorTheme);

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

    const url = `${HERO_ITEM_BASE_URL}/${heroDetails.id}/itemPopularity`;
    await fetchData<ItemPopularityData>(url).then((res) => {
      itemsResponse = res;
    });

    const getTopItems = (items: ItemPopularity): ItemPopularity => {
      return Object.entries(items)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [itemId, count]) => {
          acc[itemId] = count;
          return acc;
        }, {} as ItemPopularity);
    };

    if (itemsResponse) {
      const topHeroItems: ItemPopularityData = {
        start_game_items: getTopItems(itemsResponse.start_game_items),
        early_game_items: getTopItems(itemsResponse.early_game_items),
        mid_game_items: getTopItems(itemsResponse.mid_game_items),
        late_game_items: getTopItems(itemsResponse.late_game_items),
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
        <TextComponent weight="semibold" style={styles.titleAbility}>
          {item?.dname}
        </TextComponent>
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
                    <TextComponent> {coolDown}</TextComponent>
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
                    <TextComponent> {mana}</TextComponent>
                  </View>
                </View>
              </View>
              <TextComponent
                style={{
                  display: item?.bkbpierce ? "flex" : "none",
                  fontFamily: "QuickSand-Semibold",
                  color: "#888",
                }}
              >
                <TextComponent weight="semibold" style={{ color: "#333" }}>
                  Pierce bkb:
                </TextComponent>{" "}
                {item?.bkbpierce}
              </TextComponent>
            </View>
          </View>

          <View style={styles.content2}>
            <>
              <TextComponent
                style={{
                  display: item?.dispellable ? "flex" : "none",
                  fontFamily: "QuickSand-Semibold",
                  color: "#888",
                }}
              >
                <TextComponent weight="semibold" style={{ color: "#333" }}>
                  Dispellable:
                </TextComponent>{" "}
                {item?.dispellable}
              </TextComponent>
              <TextComponent
                weight="semibold"
                style={{
                  display: item?.dmg_type ? "flex" : "none",
                  color: "#888",
                }}
              >
                <TextComponent weight="semibold" style={{ color: "#333" }}>
                  Damage Type:
                </TextComponent>{" "}
                {item?.dmg_type}
              </TextComponent>
            </>
          </View>
        </View>
        <TextComponent weight="semibold" style={styles.textDescription}>
          {"     "}
          {item?.desc}
        </TextComponent>
        <TextComponent
          style={{
            display: item?.lore ? "flex" : "none",
            fontStyle: "italic",
            color: "#aaa",
            marginTop: 9,
            textAlign: "center",
          }}
        >
          "{item?.lore}"
        </TextComponent>
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

  function TitleContainer({ engText, ptText }: TitleContainerProps) {
    return (
      <View
        style={{
          width: "60%",
          backgroundColor: colorTheme.semilight,
          borderRadius: 7,
        }}
      >
        <LinearGradientComponent />
        <TextComponent weight="bold" style={styles.titleText}>
          {englishLanguage ? engText : ptText}
        </TextComponent>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header heroId={Number(heroId)} />
        <ScrollView>
          {loadingItems ? (
            <View style={styles.itemsContainer}>
              <TitleContainer
                engText="Popular Items"
                ptText="Itens Populares"
              />
              <ActivityIndicator size={30} color={colorTheme.semidark} />
            </View>
          ) : (
            <View style={styles.itemsContainer}>
              <View
                style={{
                  width: "50%",
                  backgroundColor: colorTheme.semilight,
                  borderRadius: 7,
                }}
              >
                <LinearGradientComponent />
                <TextComponent weight="bold" style={styles.titleText}>
                  {englishLanguage ? "Popular Items" : "Itens Populares"}
                </TextComponent>
              </View>
              <TextComponent weight="semibold" style={styles.textItem}>
                {englishLanguage ? "Start Game" : "Itens Iniciais"}
              </TextComponent>
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
              <TextComponent weight="semibold" style={styles.textItem}>
                {englishLanguage ? "Early Game" : "Início Jogo"}
              </TextComponent>
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
              <TextComponent weight="semibold" style={styles.textItem}>
                {englishLanguage ? "Mid Game" : "Meio do Jogo"}
              </TextComponent>
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
              <TextComponent weight="semibold" style={styles.textItem}>
                {englishLanguage ? "Late Game" : "Final do Jogo"}
              </TextComponent>
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
            <TitleContainer engText="Abilities" ptText="Habilidades" />
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
              <TitleContainer
                engText="Aghanim's Scepter"
                ptText="Cetro de Aghanim"
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <TextComponent weight="bold" style={styles.textTitle2}>
                  {aghanimHeroSelected?.scepter_skill_name}
                </TextComponent>
                <TextComponent weight="semibold" style={styles.textDescription}>
                  {"      " + aghanimHeroSelected?.scepter_desc}
                </TextComponent>
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
              <TitleContainer
                engText="Aghanim's Shard"
                ptText="Aghanim Shard"
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <TextComponent weight="semibold" style={styles.textTitle2}>
                  {aghanimHeroSelected?.shard_skill_name}
                </TextComponent>
                <TextComponent weight="semibold" style={styles.textDescription}>
                  {"      " + aghanimHeroSelected?.shard_desc}
                </TextComponent>
              </View>
            </View>
          </View>
          <View style={styles.itemsContainer}>
            {/* Facetas */}
            <View style={styles.facetsContainer}>
              <TitleContainer engText="Facets" ptText="Facetas" />

              {abilities &&
                abilities.facets &&
                abilities.facets.map((facets, index) => {
                  if (facets.deprecated) return;
                  return (
                    <View
                      key={index}
                      style={{
                        width: "100%",
                      }}
                    >
                      <TextComponent
                        weight="semibold"
                        style={styles.textTitle2}
                        key={index}
                      >
                        {facets.title}
                      </TextComponent>
                      <TextComponent
                        weight="semibold"
                        style={styles.textDescription}
                      >
                        {" " + facets.description}
                      </TextComponent>
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
