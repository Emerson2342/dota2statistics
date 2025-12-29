import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
} from "react-native";
import { createStyles } from "./styles";

import { HeroDetailsModel } from "@src/services/props";

import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import IntImg from "@src/images/int.png";
import AgiImg from "@src/images/agi.png";
import StrImg from "@src/images/str.png";
import AllImg from "@src/images/all.png";
import { useRouter } from "expo-router";
import { TextComponent } from "@src/components/TextComponent";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { TextInputComponent } from "@src/components/TextInputComponent";
import { Ionicons } from "@expo/vector-icons";

const COLUMNS: number = 2;

export function ListaDeHerois() {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

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

  const styles = createStyles(colorTheme);
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
          <TextComponent weight="semibold" style={styles.nameHeroText}>
            {item.localized_name}
          </TextComponent>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInputComponent
          onChangeText={(text) => HandleSearchHero(text)}
          label={textInput}
          value={textInputSearch}
        />
        <TouchableOpacity onPress={() => HandleClearSearchResults()}>
          <Ionicons name="close" size={23} color={colorTheme.semidark} />
        </TouchableOpacity>
      </View>
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity
          style={[
            styles.buttonOptions,
            {
              backgroundColor:
                attSelected === "" ? colorTheme.semidark : "transparent",
            },
          ]}
          onPress={() => handleSelectAtt("")}
        >
          <TextComponent
            weight="bold"
            style={[
              styles.textAll,
              {
                color: attSelected === "" ? "#fff" : colorTheme.semidark,
                opacity: attSelected === "" ? 1 : 0.3,
              },
            ]}
          >
            {englishLanguage ? "All" : "Todos"}
          </TextComponent>
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
        <TextComponent style={{ fontFamily: "QuickSand-Semibold" }}>
          {textSearchResult}
        </TextComponent>
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
            <ActivityIndicatorCustom
              message={
                englishLanguage ? "Loading heroes..." : "Carregando heróis..."
              }
            />
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
