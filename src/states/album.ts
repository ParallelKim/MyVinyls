import { proxy, ref } from "valtio";

import { YouTubePlayer } from "react-youtube";
import { Album } from "../types/Album";

export type YTStatus =
    | "unstarted"
    | "ended"
    | "playing"
    | "paused"
    | "buffering"
    | "video cued";

export type CustomYTPlayer = YouTubePlayer & {
    playerInfo: { playlistIndex: number };
};

export const albumState = proxy<{
    album: Album | null;
    status: YTStatus;
    player: CustomYTPlayer | null;
    duration: number;
    currentIndex: number | null;
}>({
    album: null,
    player: null,
    status: "unstarted",
    duration: 0,
    currentIndex: null,
});

export const setAlbum = (album: Album | null) => {
    albumState.album = album;
};

export const setCurrentIndex = (index: number | null) => {
    albumState.currentIndex = index;
};

export const setPlayer = (player: CustomYTPlayer) => {
    albumState.player = ref(player);
};

export const setAlbumStatus = (status: YTStatus, duration: number) => {
    albumState.status = status;
    if (status === "playing") {
        albumState.duration = duration;
        albumState.currentIndex =
            albumState.player?.playerInfo.playlistIndex ?? null;
    }
};
