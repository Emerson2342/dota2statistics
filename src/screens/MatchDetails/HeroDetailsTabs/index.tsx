import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { GraficsGoldPlayersComponent } from "./GraficsGoldPlayers";
import { HeroKillsDetailsComponent } from "./KillsDetails";
import { ItemsComponent } from "./Items";
import { AbilitiesComponent } from "./Abilities";
import { HeroDetailsModel, MatchDetailsModel } from "../../../services/props";
import { DamageComponent } from "./Damage";
import { DamageTypeComponent } from "./DamageType";

type Props = {
  matchDetails: MatchDetailsModel | null;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  radName: string;
  direName: string;
  heroArray: HeroDetailsModel[];
};

function HeroesDetailsComponent({
  matchDetails,
  refreshing,
  onRefresh,
  radName,
  direName,
  heroArray,
}: Props) {
  if (!matchDetails) return null;
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {matchDetails.players.length > 0 &&
      matchDetails.players[0].gold_t &&
      matchDetails.players[0].gold_t.length > 0 ? (
        <View
          style={[
            styles.containerItem,
            {
              padding: "1%",
              paddingBottom: "3%",
              marginTop: "3%",
            },
          ]}
        >
          <GraficsGoldPlayersComponent
            matchDetails={matchDetails}
            RadiantName={radName}
            DireName={direName}
          />
        </View>
      ) : null}

      <View style={styles.containerItem}>
        <HeroKillsDetailsComponent
          heroArray={heroArray}
          matchDetails={matchDetails}
          radName={radName}
          direName={direName}
        />
      </View>
      {matchDetails.players[0]?.damage_inflictor && (
        <View style={styles.containerItem}>
          <DamageComponent
            RadName={radName}
            DireName={direName}
            matchDetails={matchDetails}
          />
        </View>
      )}
      {matchDetails.players[0]?.damage_inflictor && (
        <View style={styles.containerItem}>
          <DamageTypeComponent
            RadName={radName}
            DireName={direName}
            matchDetails={matchDetails}
            damageInflictor="caused"
          />
        </View>
      )}
      {matchDetails.players[0]?.damage_inflictor_received && (
        <View style={styles.containerItem}>
          <DamageTypeComponent
            RadName={radName}
            DireName={direName}
            matchDetails={matchDetails}
            damageInflictor="received"
          />
        </View>
      )}
      <View style={styles.containerItem}>
        <ItemsComponent
          matchDetails={matchDetails}
          RadName={radName}
          DireName={direName}
        />
      </View>
      <View style={styles.containerItem}>
        <AbilitiesComponent
          matchDetails={matchDetails}
          RadName={radName}
          DireName={direName}
        />
      </View>
    </ScrollView>
  );
}

export const HeroesDetailsTabs = React.memo(HeroesDetailsComponent);
HeroesDetailsTabs.displayName = "HeroesDetailsTabs";

const styles = StyleSheet.create({
  containerItem: {
    width: "95%",
    alignSelf: "center",
    marginBottom: "3%",
    borderRadius: 9,
    backgroundColor: "#fff",
    elevation: 7,
  },
});
