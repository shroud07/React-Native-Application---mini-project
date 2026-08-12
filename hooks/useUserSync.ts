import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
    const { user } = useUser();
    const setCurrency = useUserStore((state) => state.setCurrency);
    const setNeedsOnboarding = useUserStore((state)=> state.setNeedsOnboading);
    const authSupabase = useSupabase();

    useEffect(() => {
        if(!user) return;

        const syncUser = async () => {
            try{
                const { data: existingUser, error: fetchError } = await
                await authSupabase
                .from("users")
                .select("clerk_id, currency")
                .eq("clerk_id" , user.id)
                .single();

                if(fetchError && fetchError.code! == "PGRST116"){
                    console.error("Error fetching user: ", fetchError);
                    setNeedsOnboarding(true);
                    return;
                }
                if(existingUser) {
                    setCurrency(existingUser.currency ?? "INR");
                    setNeedsOnboarding(!existingUser.currency);
                    return;
                }

                const email = user.emailAddresses[0].emailAddress;

                const { data: newUser, error: insertError } = await authSupabase
                .from("users")
                .upsert({
                    clerk_id: user.id,
                    email,
                    name: '${user.firstName ?? ""} ${user.lastName ?? ""}'.trim(),
                    image_url: user.imageUrl,
                }, 
                { onConflict: "clerk_id", ignoreDuplicates:false}
            )
            .select("currency")
            .single();

            } catch(error){
                
            }
        };
        syncUser();

    }, [user?.id]);

};