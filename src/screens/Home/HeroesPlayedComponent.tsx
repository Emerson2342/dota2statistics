import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { HeroDetailsModel, HeroesPlayed } from '../../../src/services/props';
import { useSettingsContext } from '../../../src/context/useSettingsContext';
import { useTheme } from '../../../src/context/useThemeContext';
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";


export function HeroesPlayedComponent({ HeroesPlayedList }: { HeroesPlayedList: HeroesPlayed[] }) {


    const { englishLanguage } = useSettingsContext();
    const { ColorTheme } = useTheme();
    const [heroArray, setHeroArray] = useState<HeroDetailsModel[]>([])


    useEffect(() => {
        setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);

    }, []);

    const RenderItem = ({ item, index }: { item: HeroesPlayed, index: number }) => {


        const heroIndex = heroArray.find((hero) => hero.id === item.hero_id);



        return (<Text>{heroIndex?.name}</Text>)
    }

    return (
        <View style={styles.container}>
            <Text>asdfasdfasdfafd</Text>
            <ScrollView >

                <FlatList
                    data={HeroesPlayedList}
                    renderItem={RenderItem}
                    keyExtractor={(item) => item.hero_id.toLocaleString()}
                    scrollEnabled={false}
                />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }

});