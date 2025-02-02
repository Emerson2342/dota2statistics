import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    width: "43%",
    alignSelf: "flex-end",
    marginRight: "5%",
  },
  buttonRadiant: {
    width: "100%",
    alignSelf: "flex-end",
    padding: "5%",
    backgroundColor: "#00617D",
    borderWidth: 3,
    borderTopColor: "#00ffff",
    borderLeftColor: "#00ffff",
    borderRightColor: "#00506b",
    borderBottomColor: "#00506b",
    borderRadius: 5,
    marginVertical: "3%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDire: {
    backgroundColor: "#5f0000",
    borderTopColor: "#ff0000",
    borderLeftColor: "#ff0000",
    borderRightColor: "#3f0000",
    borderBottomColor: "#3f0000",
  },
  buttonLanguage: {
    padding: 5,
    alignSelf: "center",
    borderWidth: 3,
    borderRadius: 5,
  },
  textButton: {
    color: "yellow",
    letterSpacing: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleIdioma: {
    color: "yellow",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  contentLanguage: {
    borderRadius: 9,
    padding: "5%",
    marginBottom: "10%",
  },
  contentLanguageSelected: {
    backgroundColor: "#050a64",
    borderWidth: 1,
    borderColor: "#fff",
  },
  textLanguage: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
});
