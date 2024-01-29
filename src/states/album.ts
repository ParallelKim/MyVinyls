import { YouTubePlayer } from "react-youtube";
import { FocusedAlbum } from "../types/Album";
import { proxy, ref } from "valtio";

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
    album: FocusedAlbum | null;
    status: YTStatus;
    player: CustomYTPlayer | null;
    duration: number;
    isNewRecord: boolean;
}>({
    album: null,
    player: null,
    status: "unstarted",
    duration: 0,
    isNewRecord: true,
});

export const setAlbum = (album: FocusedAlbum | null) => {
    albumState.album = album;
};

export const setPlayer = (player: CustomYTPlayer) => {
    albumState.player = ref(player);
};

export const setAlbumStatus = (status: YTStatus, duration: number) => {
    albumState.status = status;
    if (status === "playing") {
        albumState.duration = duration;
    }
};
