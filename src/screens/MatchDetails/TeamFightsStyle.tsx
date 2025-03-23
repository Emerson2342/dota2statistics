import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  textTime: {
    fontFamily: "QuickSand-Bold",
    color: "orange",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    width: "87%",
    alignItems: "baseline",
    marginTop: 3,
    marginBottom: 3,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  renderItemContainer: {
    backgroundColor: "#fff",
    margin: "1.7%",
    padding: "1.7%",
    borderRadius: 9,
    elevation: 7,
  },
  textTeam: {
    fontFamily: "QuickSand-Bold",
    textAlign: "center",
    marginTop: 7,
    marginBottom: 7,
  },
  containerImage: {
    flexDirection: "row",
  },
  itemImage: {
    width: Dimensions.get("screen").width * 0.063,
    aspectRatio: 1,
    borderRadius: 3,
    margin: Dimensions.get("screen").width * 0.003,
  },
  textLabel: {
    fontFamily: "QuickSand-Semibold",
    fontSize: Dimensions.get("screen").width * 0.03,
  },
  textData: {
    fontFamily: "QuickSand-Semibold",
    fontSize: Dimensions.get("screen").width * 0.027,
    color: "#333",
    textAlign: "center",
  },
});
