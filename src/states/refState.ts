import { Group, Object3D, Object3DEventMap } from "three";

import { CameraControls } from "@react-three/drei";
import { proxy } from "valtio";

export const refState = proxy<{
    root: Group<Object3DEventMap> | null;
    lpPlayer: Group<Object3DEventMap> | null;
    station: Group<Object3DEventMap> | null;
    shelf: Group<Object3DEventMap> | null;
    currentCover: Object3D | null;
    currentRecord: Object3D | null;
    panel: Object3D | null;
    [key: string]: Object3D | Group<Object3DEventMap> | null;
}>({
    root: null,
    cameraControls: null,
    lpPlayer: null,
    station: null,
    shelf: null,
    currentCover: null,
    currentRecord: null,
    panel: null,
});

export const setRoot = (root: Group<Object3DEventMap>) => {
    refState.root = root;
};

export const setShelf = (shelf: Group<Object3DEventMap>) => {
    refState.shelf = shelf;
};

export const setLpPlayer = (lpPlayer: Group<Object3DEventMap>) => {
    refState.lpPlayer = lpPlayer;
};
export const setStation = (station: Group<Object3DEventMap>) => {
    refState.station = station;
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

export const setObject = (name: string, obj: Object3D) => {
    refState[name] = obj;
};

export const controlRefState = proxy<{ cameraControls: CameraControls | null }>(
    {
        cameraControls: null,
    }
);

export const setCameraControls = (cameraControls: CameraControls) => {
    controlRefState.cameraControls = cameraControls;
};
