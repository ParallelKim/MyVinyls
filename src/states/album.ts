import { YouTubePlayer } from "react-youtube";
import { Album } from "../types/Album";
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
    album: Album | null;
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

export const setAlbum = (album: Album | null) => {
    console.log("album selected", album);
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
