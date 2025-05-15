import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    "main": {
        backgroundColor: "#333333",
    },
    "flexMain": {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center"
    },
    "field": {
        padding: 12,
        borderRadius: 8,
        color: "#ffffff",
        borderColor: "#aaaaaa",
        borderWidth: 2
    },
    "fieldLabel": {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12
    },
    "fieldContainer": {
        margin: 12,
        // flex: 1,
        gap: 8,
        justifyContent: "center",
    },
    "button": {
        backgroundColor: "#217CD1",
        padding: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        margin: 12
    },
    "buttonText": {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold"
    }
});

export default styles;