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
