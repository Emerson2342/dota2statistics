import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  textTime: {
    fontFamily: "QuickSand-Bold",
    color: "orange",
    textAlign: "center",
  },
  renderItemContainer: {
    backgroundColor: "#fff",
    margin: "1.7%",
    padding: "1.7%",
    borderRadius: 9,
    elevation: 7,
  },
  containerImage: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "47%",
    flexWrap: "wrap",
  },
  itemImage: {
    width: 23,
    aspectRatio: 1,
    borderRadius: 3,
    margin: 1.5,
  },
  textLabel: {
    fontFamily: "QuickSand-Semibold",
    fontSize: Dimensions.get("screen").width * 0.03,
  },
  textData: { color: "#4e9332" },
});
