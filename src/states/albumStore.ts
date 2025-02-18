import { create } from "zustand";
import { YouTubePlayer } from "react-youtube";
import { AnimationStatus } from "../Scene/animations/AnimationEngine";

interface Album {
    title: string;
    artist: string;
    url: string;
    list: string[];
}

interface AlbumState {
    album: Album | null;
    player: (YouTubePlayer & { playerInfo: { playlistIndex: number } }) | null;
    currentIndex: number;
    duration: number;
    status: AnimationStatus;
    setAlbum: (album: Album | null) => void;
    setPlayer: (
        player:
            | (YouTubePlayer & { playerInfo: { playlistIndex: number } })
            | null
    ) => void;
    setCurrentIndex: (index: number) => void;
    setStatus: (status: AnimationStatus, duration: number) => void;
}

const useAlbumStore = create<AlbumState>()((set) => ({
    album: null,
    player: null,
    currentIndex: 0,
    duration: 0,
    status: "idle",
    setAlbum: (album) => set({ album }),
    setPlayer: (player) => set({ player }),
    setCurrentIndex: (currentIndex) => set({ currentIndex }),
    setStatus: (status, duration) => set({ status, duration }),
}));

export default useAlbumStore;
