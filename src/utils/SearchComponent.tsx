import { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Searchbar } from "react-native-paper";
import { useTheme } from "../../src/context/useThemeContext";
import { ModalMessage } from "../../src/components/Modals/ModalMessage";
import { getErro404Message } from "./textMessage";
import { useSettingsContext } from "../../src/context/useSettingsContext";


type Props = {
    onSearch: (text: string) => void;
    placeHolder: string;
    showModalMessage: boolean;
    setShowModalMessage: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchComponent = ({ onSearch, placeHolder, showModalMessage, setShowModalMessage }: Props) => {

    const [text, setText] = useState("");
    const { ColorTheme } = useTheme();
    const { englishLanguage } = useSettingsContext();
    const erro404 = getErro404Message(englishLanguage);

    return (
        <View style={{ marginTop: 20, width: "95%" }}>
            <Searchbar
                style={styles.textInput}
                placeholder={placeHolder}
                value={text}
                onChangeText={setText}
                elevation={3}
                iconColor={ColorTheme.semidark}
                placeholderTextColor={ColorTheme.semilight}
                onIconPress={() => onSearch(text)}
            />
            <Modal
                visible={showModalMessage}
                animationType="slide"
                statusBarTranslucent={true}
                transparent={true}>
                <ModalMessage handleClose={() => setShowModalMessage(false)} message={erro404} title="Ops.." />
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
})