import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { useTheme } from "../../src/context/useThemeContext";


type Props = {
    onSearch: (text: string) => void;
    placeHolder: string;
}

export const SearchComponent = ({ onSearch, placeHolder }: Props) => {

    const [text, setText] = useState("");
    const { ColorTheme } = useTheme();


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