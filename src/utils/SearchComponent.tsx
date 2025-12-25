import { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Searchbar } from "react-native-paper";
import { ModalMessage } from "@src/components/Modals/ModalMessage";
import { getErro404Message } from "./textMessage";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { TextInputComponent } from "@src/components/TextInputComponent";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onSearch: (text: string) => Promise<void>;
  placeHolder: string;
  showModalMessage: boolean;
  setShowModalMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchComponent = ({
  onSearch,
  placeHolder,
  showModalMessage,
  setShowModalMessage,
}: Props) => {
  const [text, setText] = useState("");
  const colorTheme = useThemeStore((state) => state.colorTheme);
  const { englishLanguage } = useSettingsStore();
  const erro404 = getErro404Message(englishLanguage);

  return (
    <View
      style={{
        marginTop: 20,
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 13,
      }}
    >
      <TouchableOpacity onPress={async () => await onSearch(text)}>
        <Ionicons name="search" size={23} color={colorTheme.semidark} />
      </TouchableOpacity>
      <TextInputComponent
        label={placeHolder}
        value={text}
        onChangeText={setText}
      />
      <Modal
        visible={showModalMessage}
        animationType="slide"
        statusBarTranslucent={true}
        transparent={true}
      >
        <ModalMessage
          handleClose={() => setShowModalMessage(false)}
          message={erro404}
          title="Ops.."
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#fff",
    textAlign: "center",
    fontFamily: "QuickSand-Semibold",
    flexGrow: 1,
    marginHorizontal: "5%",
  },
});
