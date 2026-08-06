import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SignInScreen() {
    const handleSignIn = () => {
        // Later:
        // await login(email, password)

        router.replace("/");
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
            }}
        >
            <Text>Sign In</Text>

            <Pressable onPress={handleSignIn}>
                <Text>Sign In</Text>
            </Pressable>

            <Pressable
                onPress={() => router.push("/sign-up")}
            >
                <Text>Create Account</Text>
            </Pressable>
        </View>
    );
}