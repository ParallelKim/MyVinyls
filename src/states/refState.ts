import { Group, Object3D, Object3DEventMap } from "three";
import { proxy } from "valtio";

export const refState = proxy<{
    root: Group<Object3DEventMap> | null;
    lpPlayer: Group<Object3DEventMap> | null;
    shelf: Group<Object3DEventMap> | null;
    currentCover: Object3D | null;
    currentRecord: Object3D | null;
    panel: Object3D | null;
}>({
    root: null,
    lpPlayer: null,
    shelf: null,
    currentCover: null,
    currentRecord: null,
    panel: null,
});

export const setRoot = (root: Group<Object3DEventMap>) => {
    refState.root = root;
};

export const setShelf = (shelf: Group<Object3DEventMap>) => {
    refState.root = shelf;
};

export const setLpPlayer = (lpPlayer: Group<Object3DEventMap>) => {
    refState.lpPlayer = lpPlayer;
};

export const setCurrentCover = (cover: Object3D) => {
    refState.currentCover = cover;
};
export const setCurrentRecord = (record: Object3D) => {
    refState.currentRecord = record;
};

export const setPanel = (panel: Object3D) => {
    refState.panel = panel;
};
