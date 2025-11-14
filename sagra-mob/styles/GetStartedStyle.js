import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    title: {
        fontSize: 50,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: -5,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
        width: '75%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
    },
    yellowButton: {
        backgroundColor: '#FFC942',
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 5,
        width: '100%'
    },
    darkButton: {
        backgroundColor: '#424242',
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 5,
        width: '100%'
    },
    yellowButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#424242',
        textAlign: 'center',
    },
    darkButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#fff',
        textAlign: 'center',
    }
});
