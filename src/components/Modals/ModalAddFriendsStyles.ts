import { StyleSheet } from 'react-native';
import { ThemeColor } from '../../../src/services/props';


export const createStyles = (colors: ThemeColor) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: colors.semidark,
        width: '80%',
        padding: '3%',
        borderRadius: 5,
        borderWidth: 1,
        borderTopColor: "#fff",
        borderLeftColor: "#fff",
        borderRightColor: "#555",
        borderBottomColor: "#555"
    },
    textTitle: {
        width: '100%',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'yellow',
        marginBottom: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: "#999"
    },
    input: {
        backgroundColor: "#ccc",
        padding: 5,
        marginBottom: '5%',
        borderRadius: 5,
        textAlign: 'center',
        color: colors.semidark,
        borderWidth: 1,
        borderTopColor: "#888",
        borderLeftColor: "#888",
        width: '70%',
        alignSelf: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        padding: '2%'
    },
    button: {
        padding: '2%',
        width: '45%',
        alignItems: 'center',
        backgroundColor: colors.semidark,
        borderWidth: 0.5,
        borderColor: '#fff',
        borderRadius: 5
    },
    buttonSave: {
        backgroundColor: colors.semilight,
    },
    buttonText: {
        color: "yellow",
        fontWeight: 'bold',
        textAlign: 'center',
    }

})