import { atom } from "jotai";
import { Album } from "../types/Album";

export const currentAlbumAtom = atom<Album | null>(null);

export const isPlaying = atom(false);
