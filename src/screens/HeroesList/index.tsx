import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { Searchbar, RadioButton } from "react-native-paper";
import { createStyles } from "./styles";

import { useSettingsContext } from "../../context/useSettingsContext";
import { HeroDetailsModel, RootStackParamList } from "../../services/props";

import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { useTheme } from "../../../src/context/useThemeContext";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import IntImg from "../../images/int.png";
import AgiImg from "../../images/agi.png";
import StrImg from "../../images/str.png";
import AllImg from "../../images/all.png";
import { BannerAds } from "../../../src/components/BannerAds";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";

const COLUMNS: number = 2;

export function ListaDeHerois() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const [textInputSearch, setTextInputSearch] = useState("");
  const [heroesSearched, setHereoesSearched] = useState<
    HeroDetailsModel[] | undefined
  >(undefined);
  const [textResult, setTextResult] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [heroArray, setHeroArray] = useState<HeroDetailsModel[]>([]);
  const [attSelected, setAttSelected] = useState("");

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
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);
      setIsLoading(false);
    }, 500);
  }, []);

  const textSearchResult =
    heroesSearched && heroesSearched?.length > 0
      ? englishLanguage
        ? `Results for: "${textResult}"`
        : `Resultados para: "${textResult}"`
      : englishLanguage
        ? `No results found for: "${textResult}"`
        : `Nenhum resultado encontrado para: "${textResult}"`;

  const sortedList = useMemo(() => {
    return heroesSearched !== undefined
      ? [...heroesSearched].sort(ordenar)
      : [...heroArray].sort(ordenar);
  }, [heroesSearched, heroArray]);


  const currentItems =
    heroesSearched != undefined ? heroesSearched : sortedList;

  const GoToHeroDetails = (heroDetails: HeroDetailsModel | undefined) => {
    if (heroDetails) {
      navigation.navigate("HeroDetails", { heroDetails: heroDetails });
    } else {
      alert("Hero not found");
    }
  };

  const HandleSearchHero = (text: string) => {
    setIsLoading(true);
    setTextInputSearch(text);

    setTimeout(() => {
      const heroesToSearch: HeroDetailsModel[] = heroArray.filter((hero) =>
        hero.localized_name
          .toLowerCase()
          .trim()
          .includes(text.toLowerCase().trim())
      );
      setHereoesSearched(heroesToSearch);
      setTextResult(text);
      setIsLoading(false);
    }, 300);
  };

  const HandleClearSearchResults = () => {
    setTextInputSearch("");
    setTextResult(undefined);
    setHereoesSearched(undefined);
  };

  const handleSelectAtt = useCallback((att: string) => {
    setTimeout(() => {
      setAttSelected(att);
    }, 0)
  }, []);

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
      <View style={styles.radioButtonContainer}>
        <RadioButton
          value="agi"
          status={attSelected == "agi" ? 'checked' : 'unchecked'}
          onPress={() => handleSelectAtt('agi')}
          color="#3ac53a"
          uncheckedColor="#3ac53a"
        />
        <RadioButton
          value="int"
          status={attSelected == "int" ? 'checked' : 'unchecked'}
          onPress={() => handleSelectAtt('int')}
          color="#1d92b7"
          uncheckedColor="#1d92b7"
        />
        <RadioButton
          value="str"
          status={attSelected == "str" ? 'checked' : 'unchecked'}
          onPress={() => handleSelectAtt('str')}
          color="#8e2121"
          uncheckedColor="#8e2121"
        />
        <RadioButton
          value="all"
          status={attSelected == "all" ? 'checked' : 'unchecked'}
          onPress={() => handleSelectAtt('all')}
          color="#333"
          uncheckedColor="#333"
        />
        <RadioButton
          value=""
          status={attSelected == "" ? 'checked' : 'unchecked'}
          onPress={() => handleSelectAtt('')}
          color="#333"
          uncheckedColor="#333"
        />
      </View>
      <View
        style={{
          display: textResult ? "flex" : "none",
          width: "95%",
          alignItems: "center",
          marginBottom: "3%",
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
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={30} color={ColorTheme.semidark} />
            <Text style={styles.textLoading}>
              {englishLanguage ? "Loading heroes..." : "Carregando heróis..."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={currentItems}
            renderItem={({ item }) => (
              <RenderItem item={item as HeroDetailsModel} />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={COLUMNS}
            key={COLUMNS}
            initialNumToRender={50}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </View>
  );
}
