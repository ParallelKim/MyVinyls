import { AnimationStatus } from "@/Scene/managers/EventManager";

export const YOUTUBE_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    VIDEO_CUED: 5,
} as const;

export const youtubeState: { [key: number]: AnimationStatus } = {
    [YOUTUBE_STATES.UNSTARTED]: "loading",
    [YOUTUBE_STATES.ENDED]: "returning",
    [YOUTUBE_STATES.PLAYING]: "playing",
    [YOUTUBE_STATES.PAUSED]: "ready",
    [YOUTUBE_STATES.BUFFERING]: "loading",
    [YOUTUBE_STATES.VIDEO_CUED]: "ready",
};
