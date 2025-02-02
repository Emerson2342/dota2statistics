import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { styles } from './ModalLeagueDetailsStyles';
import { HandleCloseInterface, League } from '../../screens/Home/props';


export function ModalLeagueDetails({ leagueId, handleClose }: { leagueId: number, handleClose: HandleCloseInterface }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>{leagueId}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleClose()}
                    >
                        <Text>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}