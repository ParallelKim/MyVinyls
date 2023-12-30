import { Album } from "../types/Album";
import { proxy } from "valtio";

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
}>({
    album: null,
    status: "unstarted",
});

export const setAlbum = (album: Album | null) => {
    albumState.album = album;
};
