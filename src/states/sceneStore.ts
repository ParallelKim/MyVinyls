import { create } from "zustand";

interface SceneState {
    isDebug: boolean;
}

const useSceneStore = create<SceneState>()((set) => ({
    isDebug: true,
}));

export default useSceneStore;
