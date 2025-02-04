import { create } from 'zustand';
import { Group } from 'three';

interface SceneState {
    root: Group | null;
    lpPlayer: Group | null;
    station: Group | null;
    currentRecord: Group | null;
    isPlaying: boolean;
    currentTrack: string | null;
    setRoot: (root: Group | null) => void;
    setLpPlayer: (lpPlayer: Group | null) => void;
    setStation: (station: Group | null) => void;
    setCurrentRecord: (record: Group | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTrack: (track: string | null) => void;
}

const useSceneStore = create<SceneState>()((set) => ({
    root: null,
    lpPlayer: null,
    station: null,
    currentRecord: null,
    isPlaying: false,
    currentTrack: null,
    setRoot: (root) => set({ root }),
    setLpPlayer: (lpPlayer) => set({ lpPlayer }),
    setStation: (station) => set({ station }),
    setCurrentRecord: (record) => set({ currentRecord: record }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentTrack: (track) => set({ currentTrack: track }),
}));

export default useSceneStore;
