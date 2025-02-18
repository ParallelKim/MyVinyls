import { AnimationStatus } from "@/Scene/animations/EventManager";
import { Album } from "@/types/Album";
import { YouTubePlayer } from "react-youtube";
import { create } from "zustand";

interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    volume: number;
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
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
}

const usePlayerStore = create<PlayerState>()((set) => ({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    album: null,
    player: null,
    currentIndex: 0,
    status: "idle",
    setAlbum: (album) => set({ album }),
    setPlayer: (player) => set({ player }),
    setCurrentIndex: (currentIndex) => set({ currentIndex }),
    setStatus: (status, duration) => set({ status, duration }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
}));

export default usePlayerStore;
