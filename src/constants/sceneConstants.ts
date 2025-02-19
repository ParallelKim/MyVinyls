export const CAMERA_SETTINGS = {
    FOV: 45,
    POSITION: [0, 10, 30] as [number, number, number],
    NEAR: 0.1,
    FAR: 1000,
} as const;

export const SCENE_SETTINGS = {
    ROOT_POSITION: [0, 0, 0] as [number, number, number],
    AMBIENT_LIGHT: {
        INTENSITY: 2,
        POSITION: [0, 0, 30] as [number, number, number],
    },
    DEFAULT_SCALE: 5,
} as const;

export const PERFORMANCE_SETTINGS = {
    MIN: 0.5,
    MAX: 1,
} as const;
