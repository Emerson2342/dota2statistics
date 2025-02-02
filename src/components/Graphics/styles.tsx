import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    content: {
        justifyContent: "center",
        alignSelf: 'center',


    },
    title: {
        fontSize: width * 0.03,
        fontWeight: 'bold',
        color: "orange",
        padding: '1%',
    },
});