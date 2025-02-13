import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MatchDetailsModel, Player } from "../../../src/services/props";

export function HeroKillsDetails({
  matchDetails,
}: {
  matchDetails: MatchDetailsModel;
}) {
  const killsDetails = matchDetails.players.map((player) => {
    // if (!player.killed) return [];

    const heroPlayerIndex = player.hero_id;

    const kills = player.killed
      ? Object.entries(player.killed)
          .filter(([heroName]) => heroName.startsWith("npc_dota_hero"))
          .map(([heroName, count]) => ({
            heroName: heroName.replace("npc_dota_hero_", ""),
            count,
          }))
      : [];

    const killedBy = player.killed_by
      ? Object.entries(player.killed_by)
          .filter(([heroName]) => heroName.startsWith("npc_dota_hero"))
          .map(([heroName, count]) => ({
            heroName: heroName.replace("npc_dota_hero_", ""),
            count,
          }))
      : [];

    return { heroPlayerIndex, kills, killedBy };
  });

  alert(JSON.stringify(killsDetails, null, 2));

  const renderItem = ({ item, index }: { item: Player; index: number }) => {
    return (
      <View>
        {/* {Object.entries(item.killed).map(([hero, count], index) => (
          <Text key={index}>
            {hero}: {count}x
          </Text>
        ))} */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={matchDetails.players.filter(
          (player) => player.killed && player.killed_by
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.account_id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
