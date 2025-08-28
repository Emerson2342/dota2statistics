import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { GraficsGoldPlayersComponent } from "./GraficsGoldPlayers";
import { HeroKillsDetailsComponent } from "./KillsDetails";
import { ItemsComponent } from "./Items";
import { AbilitiesComponent } from "./Abilities";
import { BannerAds } from "../../../components/Admob/BannerAds";
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
  return (
    <View style={{ flex: 1 }}>
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
                marginTop: "3%",
              },
            ]}
          >
            <GraficsGoldPlayersComponent
              matchDetails={matchDetails}
              RadiantName={matchDetails?.radiant_team?.name ?? radName}
              DireName={matchDetails?.dire_team?.name ?? direName}
            />
          </View>
        ) : null}

        <View style={styles.containerItem}>
          {matchDetails ? (
            <HeroKillsDetailsComponent
              heroArray={heroArray}
              matchDetails={matchDetails}
              radName={matchDetails?.radiant_team?.name ?? radName}
              direName={matchDetails?.dire_team?.name ?? direName}
            />
          ) : null}
        </View>
        {matchDetails && matchDetails.players[0]?.damage_inflictor && (
          <View style={styles.containerItem}>
            <DamageComponent
              RadName={matchDetails?.radiant_team?.name ?? radName}
              DireName={matchDetails?.dire_team?.name ?? direName}
              matchDetails={matchDetails}
            />
          </View>
        )}
        {matchDetails && matchDetails.players[0]?.damage_inflictor && (
          <View style={styles.containerItem}>
            <DamageTypeComponent
              RadName={matchDetails?.radiant_team?.name ?? radName}
              DireName={matchDetails?.dire_team?.name ?? direName}
              matchDetails={matchDetails}
              damageInflictor="caused"
            />
          </View>
        )}
        {matchDetails && matchDetails.players[0]?.damage_inflictor_received && (
          <View style={styles.containerItem}>
            <DamageTypeComponent
              RadName={matchDetails?.radiant_team?.name ?? radName}
              DireName={matchDetails?.dire_team?.name ?? direName}
              matchDetails={matchDetails}
              damageInflictor="received"
            />
          </View>
        )}
        <View style={styles.containerItem}>
          {matchDetails ? (
            <ItemsComponent
              matchDetails={matchDetails}
              RadName={matchDetails?.radiant_team?.name ?? radName}
              DireName={matchDetails?.dire_team?.name ?? direName}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {matchDetails ? (
            <AbilitiesComponent
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
