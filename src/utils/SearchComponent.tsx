import { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Searchbar } from "react-native-paper";
import { ModalMessage } from "@src/components/Modals/ModalMessage";
import { getErro404Message } from "./textMessage";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

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
    <View style={{ marginTop: 20, width: "95%" }}>
      <Searchbar
        style={styles.textInput}
        placeholder={placeHolder}
        value={text}
        onChangeText={setText}
        elevation={3}
        iconColor={colorTheme.semidark}
        placeholderTextColor={colorTheme.semilight}
        onIconPress={async () => await onSearch(text)}
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
