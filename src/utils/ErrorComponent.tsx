import { View, Image, Text, TouchableOpacity } from "react-native";
import ErrorImage from "../images/error.png";
import { useSettingsContext } from "../../src/context/useSettingsContext";
import { useTheme } from "../../src/context/useThemeContext";

export const ErrorComponent = ({ action }: { action: () => void }) => {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const textError = englishLanguage
    ? "Oops... An error occurred while loading the data."
    : "Ops... Ocorreu um erro ao carregar os dados.";

  const textButton = englishLanguage ? "Try again" : "Tente novamente";
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ margin: 7 }}>
        <Image
          style={{
            width: 50,
            height: 50,
          }}
          source={ErrorImage}
        />
      </View>
      <Text
        style={{
          margin: 7,
          color: ColorTheme.dark,
          fontFamily: "QuickSand-Bold",
        }}
      >
        {textError}
      </Text>
      <TouchableOpacity
        onPress={action}
        style={{
          backgroundColor: ColorTheme.dark,
          borderRadius: 7,
          margin: 5,
          padding: 7,
        }}
      >
        <Text
          style={{
            color: "#fff",
            padding: 5,
            fontFamily: "QuickSand-Semibold",
          }}
        >
          {textButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
