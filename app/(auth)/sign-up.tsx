import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SignUpScreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
            }}
        >
            <Text>Sign Up</Text>

            <Pressable onPress={() => router.back()}>
                <Text>Already have an account? Sign In</Text>
            </Pressable>
        </View>
    );
}