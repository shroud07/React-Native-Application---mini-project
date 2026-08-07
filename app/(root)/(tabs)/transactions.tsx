import React from "react";
import { Text, View } from "react-native";

export default function TransactionsScreen() {
    return(
        <View
                style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold"}}>Show Transactions Screen</Text>
                </View>
    )
}