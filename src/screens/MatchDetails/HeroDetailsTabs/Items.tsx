import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  HeroDetailsModel,
  MatchDetailsModel,
  ModalItemData,
  ModalRef,
  Player,
  ThemeColor,
} from "@src/services/props";
import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import ItemsList from "@src/components/Itens/itemsList.json";
import {
  PICTURE_HERO_BASE_URL,
  PICTURE_ITEM_BASE_URL,
} from "@src/constants/player";
import { ModalItemDetails } from "@src/components/Modals/ModalItemDetails";
import { handleItemDetails } from "@src/utils/HandleItemDetails";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

const { width } = Dimensions.get("window");

function Items({
  matchDetails,
  RadName,
  DireName,
}: {
  matchDetails: MatchDetailsModel | undefined;
  RadName: string | undefined;
  DireName: string | undefined;
}) {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const [modalData, setModalData] = useState<ModalItemData | null>(null);

  const modalRef = useRef<ModalRef>(null);

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const styles = createStyles(colorTheme);

  const heroList = useMemo(() => {
    return Object.values(HeroesDetails) as HeroDetailsModel[];
  }, []);

  const renderItemItems = useCallback(
    ({ item }: { item: MatchDetailsModel }) => {
      const players = item.players;

      return (
        <View style={styles.contentItem}>
          <TextComponent weight="semibold" style={styles.title}>
            {englishLanguage ? "Items" : "Itens"}
          </TextComponent>
          <View style={styles.detailsContainer}>
            {players.map((player: Player, index: number) => {
              const hero = heroList.find((hero) => hero.id === player.hero_id);

              let imgSource = PICTURE_HERO_BASE_URL + hero?.img;

              const item_0 = ItemsList.find(
                (item) => item.id === player.item_0
              );
              const item_1 = ItemsList.find(
                (item) => item.id === player.item_1
              );
              const item_2 = ItemsList.find(
                (item) => item.id === player.item_2
              );
              const item_3 = ItemsList.find(
                (item) => item.id === player.item_3
              );
              const item_4 = ItemsList.find(
                (item) => item.id === player.item_4
              );
              const item_5 = ItemsList.find(
                (item) => item.id === player.item_5
              );
              const backpack_0 = ItemsList.find(
                (item) => item.id === player.backpack_0
              );
              const backpack_1 = ItemsList.find(
                (item) => item.id === player.backpack_1
              );
              const backpack_2 = ItemsList.find(
                (item) => item.id === player.backpack_2
              );
              const item_neutral = ItemsList.find(
                (item) => item.id === player.item_neutral
              );
              const aghanims_shard =
                player.aghanims_shard === 1
                  ? "/apps/dota2/images/dota_react/items/aghanims_shard.png?t=1593393829403"
                  : null;

              const urlItem0 = item_0?.img;
              const urlItem1 = item_1?.img;
              const urlItem2 = item_2?.img;
              const urlItem3 = item_3?.img;
              const urlItem4 = item_4?.img;
              const urlItem5 = item_5?.img;
              const urlBackPack0 = backpack_0?.img;
              const urlBackPack1 = backpack_1?.img;
              const urlBackPack2 = backpack_2?.img;
              const urlItemNeutral = item_neutral?.img;
              const urlAghanimsShard = aghanims_shard;

              return (
                <View key={index}>
                  {index === 0 ? (
                    <TextComponent
                      weight="bold"
                      style={[
                        styles.textTeam,
                        {
                          borderTopWidth: 1,
                          borderColor: colorTheme.semilight,
                        },
                      ]}
                    >
                      {RadName ? RadName : radName}
                    </TextComponent>
                  ) : (
                    <></>
                  )}
                  {index === 5 && (
                    <TextComponent
                      weight="bold"
                      style={[
                        styles.textTeam,
                        {
                          borderTopWidth: 1,
                          borderColor: colorTheme.semilight,
                        },
                      ]}
                    >
                      {DireName ? DireName : direName}
                    </TextComponent>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      paddingTop: "1.5%",
                      paddingBottom: index == 4 ? "3%" : 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "13%",
                        marginRight: 1,
                      }}
                    >
                      <Image
                        style={styles.imageHeroItems}
                        source={{
                          uri: imgSource,
                        }}
                      />
                    </View>
                    <View style={{ width: "87%", justifyContent: "center" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_0,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItem0 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItem0,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_1,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItem1 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItem1,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_2,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItem2 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItem2,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_3,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItem3 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItem3,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_4,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItem4 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItem4,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_5,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItem5 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItem5,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              backpack_0,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlBackPack0 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlBackPack0,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              backpack_1,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlBackPack1 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlBackPack1,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              backpack_2,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlBackPack2 ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlBackPack2,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              item_neutral,
                              false,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlItemNeutral ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlItemNeutral,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={urlAghanimsShard ? false : true}
                          onPress={() =>
                            handleItemDetails(
                              player.hero_id,
                              undefined,
                              true,
                              setModalData,
                              modalRef
                            )
                          }
                        >
                          <Image
                            style={[
                              styles.imageItem,
                              { backgroundColor: urlAghanimsShard ?? "#ddd" },
                            ]}
                            source={{
                              uri: PICTURE_ITEM_BASE_URL + urlAghanimsShard,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    },
    []
  );
  return (
    <View>
      <FlatList
        data={matchDetails ? [matchDetails] : []}
        renderItem={renderItemItems}
        keyExtractor={(item) => item.match_id.toString()}
        scrollEnabled={false}
      />
      <ModalItemDetails ref={modalRef} data={modalData} />
    </View>
  );
}

export const ItemsComponent = React.memo(Items);

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    title: {
      fontSize: width * 0.05,
      color: colors.semidark,
      textAlign: "center",
    },
    textTeam: {
      textAlign: "center",
      fontSize: 15,
      color: colors.semidark,
    },
    detailsContainer: {
      width: "100%",
      alignItems: "center",
      borderRadius: 5,
    },
    contentItem: {
      backgroundColor: "#fff",
      borderRadius: 9,
      padding: "1%",
      paddingBottom: "3%",
    },
    imageHeroItems: {
      width: "100%",
      aspectRatio: 1.5,
      alignSelf: "center",
      borderRadius: 7,
    },
    imageItem: {
      width: Dimensions.get("window").width * 0.07,
      height: undefined,
      aspectRatio: 1,
      borderRadius: 50,
    },
  });
