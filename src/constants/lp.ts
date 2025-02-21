import { Vector3 } from "three";

export const LP_GAP = 0.5;

export const LP_ROOT = {
    POS: {
        init: new Vector3(0, 0, 0),
    },
    ROT: {
        init: [-Math.PI / 8, 0, 0],
    },
} as const;

export const COVER = {
    POS: {
        init: new Vector3(0, 0, 0),
        focus: new Vector3(-0.13, 0, 0.2),
        play: new Vector3(-50, 0, 0),
        placing: new Vector3(-50, 0, 0),
    },
} as const;

export const RECORD = {
    POS: {
        init: new Vector3(0, 0, -0.01),
        focus: new Vector3(0, 0, 0.1),
        play: new Vector3(0, 1.5, 0),
    },
} as const;
