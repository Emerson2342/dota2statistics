import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Keyboard,
  Button,
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
import { useRouter } from "expo-router";

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
  const [currentItems, setCurrentItems] = useState<HeroDetailsModel[]>([]);

  const router = useRouter();

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

  const sortedList = useMemo(() => {
    return heroesSearched !== undefined
      ? [...heroesSearched].sort(ordenar)
      : [...heroArray].sort(ordenar);
  }, [heroesSearched, heroArray]);

  useEffect(() => {
    const baseList = heroesSearched !== undefined ? heroesSearched : sortedList;

    if (attSelected == "") {
      setCurrentItems(sortedList);
    } else {
      setCurrentItems(
        baseList.filter((hero) => hero.primary_attr === attSelected)
      );
    }
  }, [attSelected, heroesSearched, sortedList]);

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

  const GoToHeroDetails = (heroId: string) => {
    router.push({
      pathname: "/hero-details",
      params: {
        heroId: heroId,
      },
    });
  };

  const HandleSearchHero = (text: string) => {
    setIsLoading(true);
    setTextInputSearch(text);
    setAttSelected("");

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

    setTimeout(() => {
      Keyboard.dismiss();
    }, 3000);
  };

  const HandleClearSearchResults = () => {
    setTextInputSearch("");
    setTextResult(undefined);
    setHereoesSearched(undefined);
  };

  const handleSelectAtt = (att: string) => {
    if (att === attSelected) return;
    setAttSelected(att);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 175);
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
          onPress={() => GoToHeroDetails(heroDetails?.id.toString() ?? "0")}
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
        <TouchableOpacity
          style={[
            styles.buttonOptions,
            {
              backgroundColor:
                attSelected === "" ? ColorTheme.semidark : "transparent",
            },
          ]}
          onPress={() => handleSelectAtt("")}
        >
          <Text
            style={[
              styles.textAll,
              {
                color: attSelected === "" ? "#fff" : ColorTheme.semidark,
                opacity: attSelected === "" ? 1 : 0.3,
              },
            ]}
          >
            {englishLanguage ? "All" : "Todos"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOptions}
          onPress={() => handleSelectAtt("agi")}
        >
          <Image
            style={[
              styles.imageRadioButton,
              { opacity: attSelected === "agi" ? 1 : 0.3 },
            ]}
            source={AgiImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOptions}
          onPress={() => handleSelectAtt("int")}
        >
          <Image
            style={[
              styles.imageRadioButton,
              { opacity: attSelected === "int" ? 1 : 0.3 },
            ]}
            source={IntImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOptions}
          onPress={() => handleSelectAtt("str")}
        >
          <Image
            style={[
              styles.imageRadioButton,
              { opacity: attSelected === "str" ? 1 : 0.3 },
            ]}
            source={StrImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOptions}
          onPress={() => handleSelectAtt("all")}
        >
          <Image
            style={[
              styles.imageRadioButton,
              { opacity: attSelected === "all" ? 1 : 0.3 },
            ]}
            source={AllImg}
          />
        </TouchableOpacity>
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
          marginBottom: "3%",
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
