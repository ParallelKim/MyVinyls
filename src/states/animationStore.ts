import { AnimationStatus } from "Scene/animations/AnimationEngine";
import { create } from "zustand";

interface AnimationState {
    currentAnim: AnimationStatus;
    isPlaying: boolean;
    setCurrentAnim: (anim: AnimationStatus) => void;
    setIsPlaying: (isPlaying: boolean) => void;
}

const useAnimationStore = create<AnimationState>()((set) => ({
    currentAnim: "ready",
    isPlaying: false,
    setCurrentAnim: (currentAnim) => set({ currentAnim }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
}));

export default useAnimationStore;
