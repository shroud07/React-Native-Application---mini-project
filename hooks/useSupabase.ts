import { createClerkSupabaseClient } from "@/lib/schemas/supabase";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

export function useSupabase() {
    const { getToken } = useAuth();

    const client = useMemo(
        () =>
            createClerkSupabaseClient(async () => {
                const token = await getToken({ template: "supabase", skipCache: true });
                return token ?? null;
            }),
        [getToken],
    );

    return client;
}