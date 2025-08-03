import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { BannerAds } from '../../../../src/components/Admob/BannerAds';
import { useProfileContext } from '../../../../src/context/useProfileContext';
import { useTheme } from '../../../../src/context/useThemeContext';
import { useSettingsContext } from '../../../../src/context/useSettingsContext';
import { usePlayerContext } from '../../../../src/context/usePlayerContex';
import { RecentMatches, ThemeColor } from '../../../../src/services/props';
import { ProfileHeader } from './ProfileHeader';
import { LastMatches } from './LastMatches';
import { PLAYER_PROFILE_API_BASE_URL } from '../../../../src/constants/player';
import { getRecentMatches, getSearchPlayer } from '../../../../src/services/api';
import { ActivityIndicatorCustom } from '../../../../src/utils/ActivityIndicatorCustom';
import { toSteam32 } from '../../../../src/utils/steam';


export function MyProfileTabs() {


    const { ColorTheme } = useTheme();
    const { player, setPlayer, heroesPlayedId, setHeroesPlayedId } =
        usePlayerContext();
    const { profile, setProfile } = useProfileContext();
    const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
    const { englishLanguage } = useSettingsContext();
    const [isLoading, setIsLoading] = useState(false);

    const erro404 = englishLanguage
        ? "Please, make sure the Steam Id is correct and the profile is set to public!"
        : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";


    const styles = createStyles(ColorTheme);

    useEffect(() => {
        handleLoadData();
    }, [profile]);

    const handleSave = (id: string) => {
        const convertedId = toSteam32(id);
        setIsLoading(true);
        setTimeout(() => {
            setProfile({ id_Steam: convertedId });
            setIsLoading(false);
        }, 300);
    };

    const handleLoadData = async () => {
        console.log("Carregando********************");
        setIsLoading(true);
        setTimeout(async () => {
            const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
            await getSearchPlayer(searchPlayer, setPlayer);
            const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;

            await getRecentMatches(
                recentMatchesUrl,
                setRecentMatches,
                setHeroesPlayedId
            );

            setIsLoading(false);
        }, 500);
    };


    const SetSteamId = () => {
        const [text, setText] = useState("");
        return (
            <View style={styles.inputContainer}>
                <Searchbar
                    style={styles.textInput}
                    placeholder={englishLanguage ? "Search" : "Buscar"}
                    value={text}
                    onChangeText={(textInput) => setText(textInput)}
                    elevation={3}
                    iconColor={ColorTheme.semidark}
                    placeholderTextColor={ColorTheme.semilight}
                    onIconPress={() => handleSave(text)}
                />
                <Text style={styles.textErro}>{erro404}</Text>
            </View>
        );
    };

    if (isLoading) return <View style={{ flex: 1 }}>
        <ActivityIndicatorCustom message={englishLanguage ? 'Loading player details...' : 'Carrgando detalhes do jogador...'} />
    </View>

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {player == null || player.profile.account_id == 0 ? (
                    <SetSteamId />
                ) : (
                    <>
                        <View
                            style={{
                                flex: heroesPlayedId.length > 5 ? 0.3 : 0.28,
                                marginTop: "1%",
                            }}
                        >
                            <ProfileHeader
                                player={player}
                                heroesId={heroesPlayedId}
                                recentMatches={recentMatches}
                            />
                        </View>
                        <View style={{ flex: heroesPlayedId.length > 5 ? 0.7 : 0.72 }}>
                            <View style={{ flex: 1, paddingBottom: "1%" }}>
                                {player ? (
                                    <LastMatches
                                        playerId={player.profile.account_id.toString()}
                                        onRefresh={handleLoadData}
                                        recentMatches={recentMatches}
                                    />
                                ) : null}
                            </View>
                        </View>
                    </>
                )}
            </View>
            <BannerAds />
        </View>
    );
}

const createStyles = (colors: ThemeColor) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inputContainer: {
        marginTop: "3%",
        width: "95%",
        alignItems: "center",
        justifyContent: "space-around",
    },
    textErro: {
        textAlign: "center",
        padding: "5%",
        fontFamily: "QuickSand-Semibold",
        color: colors.semidark,
    },
    textInput: {
        backgroundColor: "#fff",
        textAlign: "center",
        fontFamily: "QuickSand-Semibold",
        flexGrow: 1,
        marginHorizontal: "5%",
    },
});