export const CAMERA_SETTINGS = {
    fov: 30,
} as const;

export const SCENE_SETTINGS = {
    ROOT_POSITION: [0, 0, 1] as [number, number, number],
    AMBIENT_LIGHT: {
        INTENSITY: 2,
        POSITION: [0, 0, 30] as [number, number, number],
    },
} as const;

export const PERFORMANCE_SETTINGS = {
    MIN: 0.5,
    MAX: 1,
} as const;
