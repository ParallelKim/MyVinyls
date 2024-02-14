import { proxy } from "valtio";

export const animState = proxy<{
    isPlaying: boolean;
    lastAnim: null;
    currentAnim: null | string;
}>({
    isPlaying: false,
    lastAnim: null,
    currentAnim: null,
});

export const setCurrentAnim = (anim: string | null) => {
    animState.currentAnim = anim;
};
