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
}>({
    album: null,
    status: "unstarted",
    player: null,
});

export const setAlbum = (album: Album | null) => {
    albumState.album = album;
};

export const setPlayer = (player: CustomYTPlayer) => {
    albumState.player = ref(player);
};

export const setAlbumStatus = (status: YTStatus) => {
    albumState.status = status;
};
