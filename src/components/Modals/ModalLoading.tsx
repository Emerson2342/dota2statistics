import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';


export function ModalLoading() {
    return (
        <View style={styles.container}>
            <ActivityIndicator style={{ flex: 0.3 }} size={30} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0,0,0,0.8)",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {

    },
    text: {
        color: "#fff",
        padding: '2%',
        flex: 0.5
    }

})