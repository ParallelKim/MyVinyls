import { AnimationStatus } from "@/components/managers/EventManager";
import { create } from "zustand";

interface AnimationState {
    currentAnim: AnimationStatus;
    setCurrentAnim: (anim: AnimationStatus) => void;
}

const useAnimationStore = create<AnimationState>()((set) => ({
    currentAnim: "ready",
    setCurrentAnim: (currentAnim) => set({ currentAnim }),
}));

export default useAnimationStore;
