import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../src/context/useThemeContext';
import { GraficsGoldPlayers } from './GraficsGoldPlayers';
import { HeroKillsDetails } from './KillsDetails';
import { Damage } from './Damage';
import { Items } from './Items';
import { Abilities } from './Abilities';
import { BannerAds } from '../../../src/components/BannerAds';
import { MatchDetailsModel } from '../../../src/services/props';



export function HeroDetailsTab({ matchDetails, refreshing, onRefresh, PlayerIdIndex, radName, direName }:
    { matchDetails: MatchDetailsModel | null, refreshing: boolean, onRefresh: () => Promise<void>, PlayerIdIndex: string | null, radName: string, direName: string }
) {


    const { ColorTheme } = useTheme();



    return (
        <View style={{ flex: 1, backgroundColor: ColorTheme.light }}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {matchDetails &&
                    matchDetails.players.length > 0 &&
                    matchDetails.players[0].gold_t &&
                    matchDetails.players[0].gold_t.length > 0 ? (
                    <View
                        style={[
                            styles.containerItem,
                            {
                                padding: "1%",
                                paddingBottom: "3%",
                                marginTop: "3%"
                            },
                        ]}
                    >
                        <GraficsGoldPlayers
                            matchDetails={matchDetails}
                            RadiantName={matchDetails?.radiant_team?.name ?? radName}
                            DireName={matchDetails?.dire_team?.name ?? direName}
                        />
                    </View>
                ) : null}

                <View style={styles.containerItem}>
                    {matchDetails ? (
                        <HeroKillsDetails
                            matchDetails={matchDetails}
                            radName={matchDetails?.radiant_team?.name ?? radName}
                            direName={matchDetails?.dire_team?.name ?? direName}
                        />
                    ) : null}
                </View>
                {matchDetails && matchDetails.players[0]?.damage_inflictor ? (
                    <View style={styles.containerItem}>
                        <Damage
                            RadName={matchDetails?.radiant_team?.name ?? radName}
                            DireName={matchDetails?.dire_team?.name ?? direName}
                            matchDetails={matchDetails}
                        />
                    </View>
                ) : null}
                <View style={styles.containerItem}>
                    {matchDetails ? (
                        <Items
                            playerIndex={PlayerIdIndex}
                            matchDetails={matchDetails}
                            RadName={matchDetails?.radiant_team?.name ?? radName}
                            DireName={matchDetails?.dire_team?.name ?? direName}
                        />
                    ) : null}
                </View>
                <View style={styles.containerItem}>
                    {matchDetails ? (
                        <Abilities
                            matchDetails={matchDetails}
                            RadName={matchDetails?.radiant_team?.name ?? radName}
                            DireName={matchDetails?.dire_team?.name ?? direName}
                        />
                    ) : null}
                </View>
            </ScrollView>
            <BannerAds />
        </View>
    );
}

const styles = StyleSheet.create({
    containerItem: {
        width: "95%",
        alignSelf: "center",
        marginBottom: "3%",
        borderRadius: 9,
        backgroundColor: "#fff",
        elevation: 7,
    },
})