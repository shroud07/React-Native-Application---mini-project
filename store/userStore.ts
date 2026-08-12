import { create } from "zustand";


interface UserStore{
    currency : string;
    setCurrency : (value:string) => void;
    needsOnboarding: boolean | null ;
    setNeedsOnboading: (value: boolean | null) => void;
}

export const useUserStore = create<UserStore>((set)=>({
    currency: "INR",
    setCurrency : (value) => set({ currency:value}),
    needsOnboarding: null,
    setNeedsOnboading: (value) => set({ needsOnboarding: value}),
}));