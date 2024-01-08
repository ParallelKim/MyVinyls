import { YouTubePlayer } from "react-youtube";
import { Album } from "../types/Album";
import { proxy, ref } from "valtio";

type Status =
    | "unstarted"
    | "ended"
    | "playing"
    | "paused"
    | "buffering"
    | "video cued";

export const albumState = proxy<{
    album: Album | null;
    status: Status;
    player: YouTubePlayer | null;
}>({
    album: null,
    status: "unstarted",
    player: null,
});

export const setAlbum = (album: Album | null) => {
    albumState.album = album;
};

export const setPlayer = (player: YouTubePlayer) => {
    albumState.player = ref(player);
};

export const startFrom = (index: number) => {};
