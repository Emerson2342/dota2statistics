import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { Searchbar } from "react-native-paper";
import { createStyles } from "./styles";

import { useSettingsContext } from "../../context/useSettingsContext";
import { HeroDetailsModel, RootStackParamList } from "../../services/props";

import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { useTheme } from "../../../src/context/useThemeContext";
import { Feather } from "@expo/vector-icons";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import IntImg from "../../images/int.png";
import AgiImg from "../../images/agi.png";
import StrImg from "../../images/str.png";
import AllImg from "../../images/all.png";
import { BannerAds } from "../../../src/components/BannerAds";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

const COLUMNS: number = 2;
const ITEMS_PAGE = 26;

export function ListaDeHerois() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const [textInputSearch, setTextInputSearch] = useState("");
  const [heroesSearched, setHereoesSearched] = useState<
    HeroDetailsModel[] | undefined
  >(undefined);
  const [textResult, setTextResult] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList, "HeroDetails">>();
  const styles = createStyles(ColorTheme);
  const textInput = englishLanguage ? "Search Hero" : "Procurar herói";

  const ordenar = (a: HeroDetailsModel, b: HeroDetailsModel): number => {
    if (a.localized_name < b.localized_name) {
      return -1;
    }
    if (a.localized_name > b.localized_name) {
      return 1;
    }
    return 0;
  };

  const textSearchResult =
    heroesSearched && heroesSearched?.length > 0
      ? englishLanguage
        ? `Results for: "${textResult}"`
        : `Resultados para: "${textResult}"`
      : englishLanguage
        ? `No results found for: "${textResult}"`
        : `Nenhum resultado encontrado para: "${textResult}"`;

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
  const sortedList =
    heroesSearched != undefined
      ? heroesSearched.sort(ordenar)
      : heroArray.sort(ordenar);

  const startIndex = (currentPage - 1) * ITEMS_PAGE;
  const endIndex = startIndex + ITEMS_PAGE;

  const currentItems =
    heroesSearched != undefined
      ? heroesSearched
      : sortedList.slice(startIndex, endIndex);

  let totalPages = sortedList.length / ITEMS_PAGE;

  if (!Number.isInteger(totalPages)) {
    totalPages = Math.ceil(totalPages);
  }

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const firstPage: boolean =
    heroesSearched != undefined ? false : currentPage > 1;
  const lastPage: boolean =
    heroesSearched != undefined ? false : endIndex < sortedList.length;

  const goToNextPage = () => {
    if (endIndex < sortedList.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const GoToHeroDetails = (heroDetails: HeroDetailsModel | undefined) => {
    if (heroDetails) {
      navigation.navigate("HeroDetails", { heroDetails: heroDetails });
    } else {
      alert("Hero not found");
    }
  };

  const HandleSearchHero = (text: string) => {
    //alert(textInputSearch);   
    setTextInputSearch(text)
      const heroesToSearch: HeroDetailsModel[] = heroArray.filter((hero) =>
        hero.localized_name
          .toLowerCase()
          .trim()
          .includes(text.toLowerCase().trim())
      );
      setHereoesSearched(heroesToSearch);
    setTextResult(text);
  };

  const HandleClearSearchResults = () => {
    setTextInputSearch("")
    setTextResult(undefined);
    setHereoesSearched(undefined);
  };

  const RenderItem = React.memo(({ item }: { item: HeroDetailsModel }) => {
    let attImage;
    const heroDetails = heroArray.find((hero) => hero.id === item.id);

    switch (item.primary_attr) {
      case "all":
        attImage = AllImg;
        break;
      case "str":
        attImage = StrImg;
        break;
      case "agi":
        attImage = AgiImg;
        break;
      case "int":
        attImage = IntImg;
        break;
      default:
        attImage = "Error";
        attImage = null;
    }

    return (
      <View style={styles.listaHeroi}>
        <TouchableOpacity
          style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
          onPress={() => GoToHeroDetails(heroDetails)}
        >
          <Image
            style={[styles.image]}
            source={{ uri: PICTURE_HERO_BASE_URL + item.img }}
          />
          <Image
            style={[
              styles.image,
              { width: "13%", aspectRatio: 1.5, resizeMode: "contain" },
            ]}
            source={attImage}
          />
          <Text style={styles.nameHeroText}>{item.localized_name}</Text>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <BannerAds />
      <View style={styles.inputContainer}>
        <Searchbar
          placeholder={textInput}
          style={styles.textInput}
          value={textInputSearch}
          elevation={3}
          iconColor={ColorTheme.semidark}
          placeholderTextColor={ColorTheme.semilight}
          onChangeText={(text) => HandleSearchHero(text)}
          onClearIconPress={() => HandleClearSearchResults()}
        />
      </View>
      <View
        style={{
          display: textResult ? "flex" : "none",
          width: "95%",
          alignItems: "center",
          marginBottom: '3%'
        }}
      >
        <Text style={{ fontFamily: "QuickSand-Semibold" }}>
          {textSearchResult}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <FlatList
          data={currentItems}
          renderItem={({ item }) => (
            <RenderItem item={item as HeroDetailsModel} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={COLUMNS}
          key={COLUMNS}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "75%",
        }}
      >
        <TouchableOpacity
          onPress={() => goToPreviousPage()}
          style={firstPage ? styles.button : [styles.button, { opacity: 0.3 }]}
          disabled={firstPage ? false : true}
        >
          <Feather name="chevron-left" color={ColorTheme.semidark} size={30} />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {pagination.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: item === currentPage ? 10 : 7,
                  height: item === currentPage ? 10 : 7,
                  backgroundColor:
                    item === currentPage ? ColorTheme.standard : "#aaa",
                  borderRadius: 30,
                  margin: 5,
                }}
              />
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => goToNextPage()}
          style={lastPage ? styles.button : [styles.button, { opacity: 0.3 }]}
          disabled={lastPage ? false : true}
        >
          <Feather name="chevron-right" color={ColorTheme.semidark} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
