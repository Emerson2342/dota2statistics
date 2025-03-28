import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, Dimensions } from 'react-native';
import { HeroDetailsModel, HeroesPlayed } from '../../../src/services/props';
import { useSettingsContext } from '../../../src/context/useSettingsContext';
import { useTheme } from '../../../src/context/useThemeContext';
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from '../../../src/constants/player';
import { RadioButton } from 'react-native-paper';
import { BannerAds } from '../../../src/components/BannerAds';


export function HeroesPlayedComponent({ HeroesPlayedList }: { HeroesPlayedList: HeroesPlayed[] }) {


    const { englishLanguage } = useSettingsContext();
    const [heroArray, setHeroArray] = useState<HeroDetailsModel[]>([]);
    const [checked, setChecked] = useState('mostPlayed');
    const [orderedList, setOrderedList] = useState<HeroesPlayed[]>(HeroesPlayedList);
    const { ColorTheme } = useTheme();

    const width = Dimensions.get('screen').width * 0.13;

    useEffect(() => {
        setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);
    }, []);

    const ordLastPlayed = () => {
        setOrderedList(prevHeroArray =>
            [...prevHeroArray].sort((a, b) => b.last_played - a.last_played)
        );
    }
    const ordMostPlayed = () => {
        setOrderedList(HeroesPlayedList);
    }

    const RenderItem = ({ item, index }: { item: HeroesPlayed, index: number }) => {

        const startDate = new Date(item.last_played * 1000);
        const hoursDate = startDate.getHours();
        const minutesDate = startDate.getMinutes();

        const formattedTime = `${hoursDate
            .toString()
            .padStart(2, "0")}:${minutesDate.toString().padStart(2, "0")}`;

        const heroIndex = heroArray.find((hero) => hero.id === item.hero_id);

        const winrate = ((item.win / item.games) * 100);



        return (
            <View style={styles.renderItemContainer}>

                <Text style={styles.textHeroName}>{heroIndex?.localized_name}</Text>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                    <View style={{ width: "10%" }}>

                        <Image
                            style={{ width: width, aspectRatio: 1.5, borderRadius: 7 }}
                            source={{ uri: PICTURE_HERO_BASE_URL + heroIndex?.img }}
                        />
                    </View>
                    <View style={{ width: "85%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>

                            <Text style={styles.textLabel}>{englishLanguage ? "Last Played:" : "Última vez jogado:"}  <Text style={styles.textInfo}>{startDate.toLocaleDateString(englishLanguage ? "en-US" : "pt-BR")} {formattedTime}</Text></Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <Text style={styles.textLabel}>Winrate: <Text style={styles.textInfo}>{winrate.toFixed(2)}%</Text></Text>

                            <Text style={styles.textLabel}>{englishLanguage ? "Matches" : "Partidas"} : <Text style={styles.textInfo}>{item.games}</Text></Text>
                            <Text style={styles.textLabel}>{englishLanguage ? "Wins" : "Vitórias"} : <Text style={styles.textInfo}>{item.win}</Text></Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: ColorTheme.light }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '75%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton
                        value="mostPlayed"
                        status={checked === 'mostPlayed' ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked('mostPlayed'); ordMostPlayed() }}
                    />
                    <Text style={styles.textLabel}>{englishLanguage ? "Most Played" : "Mais Jogados"}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton
                        value="lastTimePlayed"
                        status={checked === 'lastTimePlayed' ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked('lastTimePlayed'); ordLastPlayed() }}
                    />
                    <Text style={styles.textLabel}>{englishLanguage ? "Last Played" : "Últimos Jogados"}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ width: "100%", alignItems: "center" }}>

                <FlatList
                    data={orderedList}
                    renderItem={RenderItem}
                    keyExtractor={(item) => item.hero_id.toLocaleString()}
                    scrollEnabled={false}
                    initialNumToRender={20}
                />

            </ScrollView>
            <BannerAds />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingTop: 7,
    },
    textHeroName: {
        fontFamily: "QuickSand-Bold",
        textAlign: "center",
        fontSize: Dimensions.get('screen').width * 0.037,
        color: "orange",
        margin: '1%'
    },
    textLabel: {
        fontFamily: "QuickSand-Bold"
    },
    textInfo: {
        fontFamily: "QuickSand-Semibold",
        color: "#888"
    },
    renderItemContainer: {
        padding: '1%',
        margin: '1%',
        backgroundColor: "#fff",
        borderRadius: 9
    }

});