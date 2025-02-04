import { create } from 'zustand';
import { YouTubePlayer } from 'react-youtube';

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
    status: string;
    setAlbum: (album: Album | null) => void;
    setPlayer: (player: (YouTubePlayer & { playerInfo: { playlistIndex: number } }) | null) => void;
    setCurrentIndex: (index: number) => void;
    setStatus: (status: string, duration: number) => void;
}

const useAlbumStore = create<AlbumState>()((set) => ({
    album: null,
    player: null,
    currentIndex: 0,
    duration: 0,
    status: '',
    setAlbum: (album) => set({ album }),
    setPlayer: (player) => set({ player }),
    setCurrentIndex: (currentIndex) => set({ currentIndex }),
    setStatus: (status, duration) => set({ status, duration }),
}));

export default useAlbumStore;
