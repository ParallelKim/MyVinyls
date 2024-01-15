import { Group, Object3DEventMap } from "three";
import { proxy } from "valtio";

export const refState = proxy<{
    root: Group<Object3DEventMap> | null;
    lpPlayer: Group<Object3DEventMap> | null;
    shelf: Group<Object3DEventMap> | null;
}>({
    root: null,
    lpPlayer: null,
    shelf: null,
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
