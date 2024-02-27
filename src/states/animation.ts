import { proxy } from "valtio";

export const animState = proxy<{
    isPlaying: boolean;
    lastAnim: null;
    currentAnim: null | string;
}>({
    isPlaying: false,
    lastAnim: null,
    currentAnim: "idle",
});

export const setCurrentAnim = (anim: string | null) => {
    animState.currentAnim = anim;
};

export const setIsPlaying = (isPlaying: boolean) => {
    animState.isPlaying = isPlaying;
};
