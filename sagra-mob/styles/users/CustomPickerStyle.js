import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    },

    inputContainerError: {
        borderColor: '#ff3b30',
        borderWidth: 1.5,
    },

    inputIcon: {
        marginRight: 10,
    },

    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#333',
    },

    customPickerContainer: {
        marginBottom: 10,
    },

    customPickerInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 45,
    },

    customPickerInputError: {
        borderColor: "#e63946",
    },

    customPickerText: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        color: "#333",
    },

    customPickerPlaceholder: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        color: "#999",
    },

    customPickerIcon: {
        marginRight: 8,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: "85%",
        padding: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },

    pickerOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    pickerOptionText: {
        fontSize: 16,
        textAlign: "center",
        fontFamily: "Poppins_500Medium",
        color: "#333",
    },

    modalTitle: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        textAlign: "left",
        marginBottom: 10,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
        borderBottomWidth: 1,
    }
});

export default styles;

