import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/context/useThemeContext';
import { ThemeColor } from '../../src/services/props';



export function ActivityIndicatorCustom({ message }: { message: string }) {
    const { ColorTheme } = useTheme();
    const styles = createStyles(ColorTheme);
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }}
        >
            <ActivityIndicator color={ColorTheme.dark} />
            <Text style={styles.textLoading}>
                {message}
            </Text>
        </View>
    );
}

const createStyles = (colors: ThemeColor) => StyleSheet.create({
    textLoading: {
        fontFamily: "QuickSand-Bold",
        fontSize: 15,
        color: colors.dark,
        marginBottom: "1%",
    },
})