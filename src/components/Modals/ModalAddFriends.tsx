import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { FriendDetailsModel, HandleCloseInterface } from '../../screens/Home/props';
import { useFriendsListContext } from '../../context/useFriendsListContext';
import { useSettingsContext } from '../../../src/context/useSettingsContext';
import { createStyles } from './ModalAddFriendsStyles';
import { ModalMessage } from './ModalMessage';
import { useTheme } from '../../../src/context/useThemeContext';


export function ModalAddFriends({ handleClose }: { handleClose: HandleCloseInterface }) {

    const { friendsList, setFriendsList } = useFriendsListContext();

    const { englishLanguage } = useSettingsContext();
    const { ColorTheme } = useTheme();

    const [friendName, setFriendName] = useState('');
    const [friendId, setFriendId] = useState('');

    const [enMessage, setEngMessage] = useState<string>("");
    const [porMessage, setPorMessage] = useState<string>("");

    const [modalMessageVisible, setModalMessageVisible] = useState<boolean>(false);

    const message = englishLanguage ? enMessage : porMessage
    const styles = createStyles(ColorTheme);


    const handleSalvar = () => {
        const verificarId = /^[0-9]+$/;

        if (friendName === '') {

            setEngMessage("Name can't be empty!");
            setPorMessage("Nome não pode ficar vazio!");
            setModalMessageVisible(true);
        } else if (!verificarId.test(friendId)) {

            setEngMessage("ID steam number must be just numbers!");
            setPorMessage("O ID do jogador deve conter apenas números!");
            setModalMessageVisible(true);
        } else {
            const newFriend: FriendDetailsModel = {
                friend: friendName.trim(),
                idFriend: parseInt(friendId, 10),
                avatar: '',
                personaname: '',
                name: '',
                account_id: 0,
                medal: 0,
                att: ''
            }
            setFriendsList([...friendsList, newFriend]);
            handleClose();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text
                    style={styles.textTitle}
                >Adicionar Amigo</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Digite o nome do jogador'
                    placeholderTextColor={'#888'}
                    // value={friendName}
                    onChangeText={setFriendName}
                />
                <TextInput
                    keyboardType='numeric'
                    style={styles.input}
                    placeholder='Digite o ID do jogador'
                    placeholderTextColor={'#888'}
                    // value={friendId}
                    onChangeText={setFriendId}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleClose()}
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            <Text style={[styles.buttonText, { color: "#fff" }]}>F</Text>echar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonSave]}
                        onPress={handleSalvar}
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            <Text style={[styles.buttonText, { color: "#fff" }]}>S</Text>alvar</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <Modal
                visible={modalMessageVisible}
                statusBarTranslucent={true}
                animationType='fade'
                transparent={true}
            >
                <ModalMessage
                    handleClose={() => setModalMessageVisible(false)}
                    title='Erro'
                    message={message}
                />
            </Modal>
        </View>
    );
}
