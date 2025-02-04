import { create } from 'zustand';

interface AnimationState {
    currentAnim: string;
    isPlaying: boolean;
    setCurrentAnim: (anim: string) => void;
    setIsPlaying: (isPlaying: boolean) => void;
}

const useAnimationStore = create<AnimationState>()((set) => ({
    currentAnim: '',
    isPlaying: false,
    setCurrentAnim: (currentAnim) => set({ currentAnim }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
}));

export default useAnimationStore;
