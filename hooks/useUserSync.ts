import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

const getUserDisplayName = (user: ReturnType<typeof useUser>["user"]) => {
    if (!user) return "";
    return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
};

export const useUserSync = () => {
    const { user } = useUser();
    const setCurrency = useUserStore((state) => state.setCurrency);
    const setNeedsOnboarding = useUserStore((state) => state.setNeedsOnboading);
    const authSupabase = useSupabase();

    useEffect(() => {
        if (!user?.id) return;

        const syncUser = async () => {
            const fullName = getUserDisplayName(user);
            const email = user.emailAddresses[0]?.emailAddress ?? null;

            try {
                const { data: existingUser, error: fetchError } = await authSupabase
                    .from("users")
                    .select("clerk_id, currency, email, name, image_url")
                    .eq("clerk_id", user.id)
                    .maybeSingle();

                if (fetchError && fetchError.code !== "PGRST116") {
                    console.error("Error fetching user:", fetchError);
                    setNeedsOnboarding(true);
                    return;
                }

                if (existingUser) {
                    const updatedProfile = {
                        email: email ?? existingUser.email,
                        name: fullName || existingUser.name || "",
                        image_url: user.imageUrl || existingUser.image_url,
                    };

                    const shouldUpdate =
                        updatedProfile.email !== existingUser.email ||
                        updatedProfile.name !== existingUser.name ||
                        updatedProfile.image_url !== existingUser.image_url;

                    if (shouldUpdate) {
                        const { error: updateError } = await authSupabase
                            .from("users")
                            .update(updatedProfile)
                            .eq("clerk_id", user.id);

                        if (updateError) {
                            console.error("Error updating user:", updateError);
                        }
                    }

                    setCurrency(existingUser.currency ?? "INR");
                    setNeedsOnboarding(!existingUser.currency);
                    return;
                }

                const { data: newUser, error: insertError } = await authSupabase
                    .from("users")
                    .upsert(
                        {
                            clerk_id: user.id,
                            email,
                            name: fullName,
                            image_url: user.imageUrl,
                        },
                        { onConflict: "clerk_id", ignoreDuplicates: false },
                    )
                    .select("currency")
                    .maybeSingle();

                if (insertError) {
                    console.error("Error upserting user:", insertError);
                    setNeedsOnboarding(true);
                    return;
                }

                setCurrency(newUser?.currency ?? "INR");
                setNeedsOnboarding(!newUser?.currency);

                const { error: accountError } = await authSupabase.from("accounts").insert({
                    user_id: user.id,
                    name: "Cash",
                    type: "Cash",
                    balance: 0,
                    is_default: true,
                });

                if (accountError) {
                    console.error("Error creating default account:", accountError);
                }
            } catch (error) {
                console.error("Unexpected sync error:", error);
                setNeedsOnboarding(true);
            }
        };

        syncUser();
    }, [user, authSupabase]);
};